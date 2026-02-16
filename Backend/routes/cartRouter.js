const express = require("express");
const addToCart = require("../controllers/cartController.js");
const protect = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Test endpoint to verify route is working
router.get("/test", (req, res) => {
  console.log("✅ Cart test endpoint hit!");
  res.json({ message: "Cart endpoint is working!" });
});

router.post("/add", protect, addToCart);

module.exports = router;
