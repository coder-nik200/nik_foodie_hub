const express = require("express");
const { getSignup, getLogin, Logut } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", getSignup);
router.post("/login", getLogin);
router.get("/logout", Logut);

module.exports = router;
