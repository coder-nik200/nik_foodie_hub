const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Pizza", "Sweet", "Drink"],
    },

    photoURL: {
      type: String,
      required: true,
    },

    usp: {
      type: String,
    },

    weight: {
      type: String,
    },

    pieces: {
      type: String,
    },

    serves: {
      type: String,
    },

    price: {
      mrp: {
        type: Number,
        required: true,
      },
      discountedPrice: {
        type: Number,
        required: true,
      },
      discountPercent: {
        type: Number,
        default: 0,
      },
    },

    rating: {
      value: {
        type: Number,
        default: 0,
      },
      reviews: {
        type: Number,
        default: 0,
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Sweet", sweetSchema);
