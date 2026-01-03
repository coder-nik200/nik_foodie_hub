const express = require("express");
const {
  getFoodOptions,
  getFoodById,
  getCurrentHits,
} = require("../controllers/foodController");

const router = express.Router();

router.get("/food-options", getFoodOptions);
router.get("/view-all-hits", getCurrentHits);
router.get("/:id", getFoodById);

module.exports = router;
