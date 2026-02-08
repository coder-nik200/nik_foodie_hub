import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const getProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.json(null);

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
      if (err) return res.status(401).json(null);

      const user = await User.findById(data.userId).select("-password");
      res.json(user);
    });
  } catch (err) {
    res.json(null);
  }
};
