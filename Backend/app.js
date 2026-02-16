//External Module
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

//Local Module
const userRouter = require("./routes/userRouter");
const foodRouter = require("./routes/foodRouter");
const cartRouter = require("./routes/cartRouter");
const corsOptions = require("./config/cors");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/static", express.static("data"));

app.use(userRouter);
app.use("/foods", foodRouter);
app.use("/cart", cartRouter);

//Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
