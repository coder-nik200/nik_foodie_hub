//External Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

//Middlewares
app.use(
  cors({
    origin: "http://http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

//Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/", (req, res, next) => {
  res.send("Hi! Nitish here...");
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 4000");
});
