const express = require("express");
const {
  addToCart,
  removeFromCart,
  clearCart,
  decrementCartItem,
  getCart,
} = require("../controllers/cartController.js");
const protect = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Test endpoint to verify route is working
router.get("/test", (req, res) => {
  console.log("✅ Cart test endpoint hit!");
  res.json({ message: "Cart endpoint is working!" });
});

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.post("/remove", protect, removeFromCart);
router.post("/clear", protect, clearCart);
router.post("/decrement", protect, decrementCartItem);

module.exports = router;
