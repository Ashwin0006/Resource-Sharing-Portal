import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access token required" 
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key_for_development_only";
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired" 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: "Authentication error" 
    });
  }
};

export const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key_for_development_only";
  return jwt.sign({ userId }, jwtSecret, { 
    expiresIn: "7d" 
  });
};
