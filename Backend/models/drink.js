import mongoose from "mongoose";

const drinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    photoURL: {
      type: String,
      required: true,
    },

    usp: String,
    weight: String,
    pieces: String,
    serves: String,

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
      value: Number,
      reviews: Number,
    },

    category: {
      type: String,
      default: "drink",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Drink", drinkSchema);
