const express = require("express");
const {
  getFoodOptions,
  getFoodById,
  getCurrentHits,
  getSweetFood,
  getDrinks,
} = require("../controllers/foodController");

const router = express.Router();

router.get("/food-options", getFoodOptions);
router.get("/view-all-hits", getCurrentHits);
router.get("/sweet", getSweetFood);
router.get("/drinks", getDrinks);
router.get("/:id", getFoodById);

module.exports = router;
