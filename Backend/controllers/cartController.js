const Cart = require("../models/cart");
const Food = require("../models/food");

const addToCart = async (req, res) => {
  console.log("\n🛒 ----- ADD TO CART REQUEST ----- ");
  console.log("📍 Route hit: /cart/add");
  console.log("📦 BODY:", req.body);
  console.log("👤 USER:", req.user);
  console.log("🍪 COOKIES:", req.cookies);

  try {
    // 1️⃣ Auth check (important)
    if (!req.user || !req.user.id) {
      console.log("❌ Unauthorized - missing user");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { foodId } = req.body;

    console.log("✅ Auth passed - userId:", userId);
    console.log("🍔 Food ID received:", foodId);

    if (!foodId) {
      console.log("❌ Missing foodId in request body");
      return res.status(400).json({ message: "Food ID is required" });
    }

    // 2️⃣ Check food exists
    const food = await Food.findById(foodId);
    // const food = await Food.findOne({ variantId: foodId });

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // 3️⃣ Get or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    // 4️⃣ Check if item already in cart
    const existingItem = cart.items.find(
      (item) => item.food.toString() === food._id.toString(),
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        food: food._id, // still store ObjectId in cart
        quantity: 1,
        price: food.price?.discountedPrice || food.discountedPrice,
      });
    }

    // 5️⃣ Save cart
    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({
      message: "Failed to add item to cart",
    });
  }
};

module.exports = addToCart;
