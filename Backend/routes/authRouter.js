const express = require("express");
const authRouter = express.Router();

const authController = require("../controllers/authController");

authRouter.get("/profile", authController.getProfile);

module.exports = authRouter;
