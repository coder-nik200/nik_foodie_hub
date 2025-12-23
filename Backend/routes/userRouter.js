const express = require("express");
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json("User route working");
});

module.exports = userRouter;
