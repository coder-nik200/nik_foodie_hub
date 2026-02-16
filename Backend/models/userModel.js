const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["guest", "host"],
      required: true,
      default: "guest",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
