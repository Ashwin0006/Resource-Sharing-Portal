import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", routes);

const PORT = process.env.PORT || 5000;

// DB + Server
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
