//External Module
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

//Local Module
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const foodRouter = require("./routes/foodRouter");
const corsOptions = require("./config/cors");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/static", express.static("data"));

app.use("/auth", authRouter);
app.use(userRouter);
app.use("/foods", foodRouter);

//Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
