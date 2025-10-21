import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import resourceRoutes from "./routes/resourceRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Debug environment variables
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);

/*
app.listen(5000, () => console.log("Server running on port 5000"));
*/
module.exports = app;