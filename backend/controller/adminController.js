import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const adminSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!password || !username.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const alreadyAdmin = await Admin.findOne({ username });
    if (alreadyAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this username already exists.",
      });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const admin = new Admin({
      username: username.trim(),
      password: hashPass,
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res
      .status(201)
      .json({ success: true, message: "Admin created successfully.", token });
  } catch (error) {
    console.log("Error in admin signup: ", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server errror." });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log("Error in admin login: ", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server errror." });
  }
};
