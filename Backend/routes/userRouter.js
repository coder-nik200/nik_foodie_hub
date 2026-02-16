const express = require("express");
const {
  getSignup,
  getLogin,
  Logout,
  getMe,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", getSignup);
router.post("/login", getLogin);
router.get("/logout", Logout);
router.get("/me", authMiddleware, getMe);

module.exports = router;
