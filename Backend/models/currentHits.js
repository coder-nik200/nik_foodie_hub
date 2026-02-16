import mongoose from "mongoose";

const currentHitsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: String,
    category: String,
    photoURL: String,
    usp: String,
    weight: String,
    pieces: String,
    serves: String,
    price: {
      mrp: Number,
      discountedPrice: Number,
      discountPercent: Number,
    },
    rating: {
      value: Number,
      reviews: Number,
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("CurrentHits", currentHitsSchema);
