const Cart = require("../models/cart");
const Food = require("../models/food");
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
        ? products.find((item) => item.id === foodId)
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
    // 1️⃣ Auth check (important)
    if (!req.user || !req.user._id) {
      console.log("❌ Unauthorized - missing user");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { foodId } = req.body;

    console.log("✅ Auth passed - userId:", userId);
    console.log("🍔 Food ID received:", foodId);

    if (!foodId) {
      console.log("❌ Missing foodId in request body");
      return res.status(400).json({ message: "Food ID is required" });
    }

    // 2️⃣ Check food exists (try MongoDB first, then JSON)
    let food = await Food.findById(foodId);

    if (!food) {
      // Try to find in JSON files
      food = findFoodInJSON(foodId);
    }

    if (!food) {
      console.log("❌ Food not found");
      return res.status(404).json({ message: "Food not found" });
    }

    console.log("✅ Food found:", food.name);

    // 3️⃣ Get or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    // 4️⃣ Check if item already in cart
    // For JSON data, use foodId; for MongoDB, use _id
    const foodIdentifier = food._id || food.id;
    const existingItem = cart.items.find((item) => {
      const itemId = item.food instanceof String ? item.food : item.food._id;
      return itemId.toString() === foodIdentifier.toString();
    });

    if (existingItem) {
      existingItem.quantity += 1;
      console.log("✅ Item quantity updated");
    } else {
      cart.items.push({
        food: foodIdentifier,
        quantity: 1,
        price: food.price?.discountedPrice || food.discountedPrice || 0,
        name: food.name,
        photoURL: food.photoURL,
      });
      console.log("✅ Item added to cart");
    }

    // 5️⃣ Save cart
    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error.message);
    res.status(500).json({
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

module.exports = addToCart;
