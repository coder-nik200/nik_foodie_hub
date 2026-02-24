const Cart = require("../models/cart");
const Food = require("../models/food");
const mongoose = require("mongoose");
// Try to access Drink/Sweet models if they've been registered elsewhere
const Drink = mongoose.models.Drink;
const Sweet = mongoose.models.Sweet || require("../models/sweet");
const fs = require("fs");
const path = require("path");

// Helper function to find food in JSON files
const findFoodInJSON = (foodId) => {
  const dataPath = path.join(__dirname, "../data");
  const files = [
    "currenthits.json",
    "sweetsData.json",
    "drinksData.json",
    "fastFoodData.json",
    "foodData.json",
  ];

  for (const file of files) {
    try {
      const data = JSON.parse(
        fs.readFileSync(path.join(dataPath, file), "utf8"),
      );
      const products = data.products || data;
      const food = Array.isArray(products)
        ? products.find(
            (item) =>
              item.id === foodId ||
              item.variantId === foodId ||
              item._id === foodId ||
              String(item.id) === String(foodId),
          )
        : products[foodId];
      if (food) return food;
    } catch (error) {
      // Continue to next file
    }
  }
  return null;
};

const addToCart = async (req, res) => {
  console.log("\n🛒 ----- ADD TO CART REQUEST ----- ");
  console.log("📍 Route hit: /cart/add");
  console.log("📦 BODY:", req.body);
  console.log("👤 USER:", req.user);

  try {
    const userId = req.user._id;
    const { foodId } = req.body; // ✅ MUST match frontend

    console.log("✅ Auth passed - userId:", userId);
    console.log("🍔 Food ID received:", foodId);

    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.food.toString() === foodId,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        food: food._id, // ✅ MUST be this
        quantity: 1,
      });
    }

    await cart.save();

    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// const addToCart = async (req, res) => {
//   console.log("\n🛒 ----- ADD TO CART REQUEST ----- ");
//   console.log("📍 Route hit: /cart/add");
//   console.log("📦 BODY:", req.body);
//   console.log("👤 USER:", req.user);

//   try {
//     // 1️⃣ Auth check (important)
//     if (!req.user || !req.user._id) {
//       console.log("❌ Unauthorized - missing user");
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const userId = req.user._id;
//     const { foodId } = req.body;

//     console.log("✅ Auth passed - userId:", userId);
//     console.log("🍔 Food ID received:", foodId);

//     if (!foodId) {
//       console.log("❌ Missing foodId in request body");
//       return res.status(400).json({ message: "Food ID is required" });
//     }

//     // 2️⃣ Check food exists (try MongoDB: Food, Drink, Sweet; then JSON)
//     let food = null;

//     // Try Food collection
//     try {
//       food = await Food.findById(foodId);
//     } catch (e) {
//       // ignore cast errors
//     }

//     // Try Drink collection
//     if (!food) {
//       try {
//         food = await Drink.findById(foodId);
//       } catch (e) {}
//     }

//     // Try Sweet collection
//     if (!food) {
//       try {
//         food = await Sweet.findById(foodId);
//       } catch (e) {}
//     }

//     // Finally try JSON fallback
//     if (!food) {
//       food = findFoodInJSON(foodId);
//     }

//     if (!food) {
//       console.log("❌ Food not found");
//       return res.status(404).json({ message: "Food not found" });
//     }

//     console.log("✅ Food found:", food.name);

//     // 3️⃣ Get or create cart
//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       cart = new Cart({
//         user: userId,
//         items: [],
//       });
//     }

//     // 4️⃣ Check if item already in cart
//     // For MongoDB documents, use _id; for JSON objects use id or variantId
//     const foodIdentifier = food._id || food.id || food.variantId || foodId;

//     const existingItem = cart.items.find((item) => {
//       // item.food may be an ObjectId, a string, or populated object
//       const itemId = item.food?.toString
//         ? item.food.toString()
//         : String(item.food);
//       return itemId === String(foodIdentifier);
//     });

//     if (existingItem) {
//       existingItem.quantity += 1;
//       console.log("✅ Item quantity updated");
//     } else {
//       cart.items.push({
//         food: food._id,
//         quantity: 1,
//       });

//       console.log("✅ Item added to cart");
//     }

//     // 5️⃣ Save cart
//     await cart.save();

//     res.status(200).json({
//       message: "Item added to cart",
//       cart,
//     });
//   } catch (error) {
//     console.error("ADD TO CART ERROR:", error.message);
//     res.status(500).json({
//       message: "Failed to add item to cart",
//       error: error.message,
//     });
//   }
// };

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.body;

    if (!foodId)
      return res.status(400).json({ message: "Food ID is required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => String(item.food) !== String(foodId),
    );

    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    console.error("REMOVE FROM CART ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to remove item", error: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.error("CLEAR CART ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to clear cart", error: err.message });
  }
};

// Decrement Cart Item
const decrementCartItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { foodId } = req.body;

    if (!foodId)
      return res.status(400).json({ message: "Food ID is required" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => String(item.food) === String(foodId),
    );

    if (itemIndex === -1)
      return res.status(404).json({ message: "Item not found in cart" });

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1); // remove if quantity becomes 0
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Decrement Cart Error:", error);
    res
      .status(500)
      .json({ message: "Failed to decrement item", error: error.message });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;

    let cart = await Cart.findOne({ user: userId }).populate("items.food");

    // if (!cart) {
    //   // Return empty cart if none exists
    //   return res.status(200).json({ cart: [] });
    // }

    if (!cart) {
      return res.status(200).json({ cart: { items: [] } });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res
      .status(500)
      .json({ message: "Failed to get cart", error: error.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  clearCart,
  decrementCartItem,
  getCart,
};
