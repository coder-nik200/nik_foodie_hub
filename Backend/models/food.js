const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      mrp: { type: Number, required: true },
      discountedPrice: Number,
      discountPercent: Number,
    },

    image: String,

    category: {
      type: String,
      enum: ["veg", "non-veg", "beverages", "dessert"],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Food", foodSchema);
