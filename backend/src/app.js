import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import resourceRoutes from "./routes/resourceRoutes.js";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Debug environment variables
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  }
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10, // Only 10 login/register attempts per 10 mins
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  }
});

const app = express();

app.use(cors());
app.use(apiLimiter);
app.use("/api/auth", authLimiter);
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err.message));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
