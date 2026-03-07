import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    console.log("Error in verifying admin: ", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyAdmin;
