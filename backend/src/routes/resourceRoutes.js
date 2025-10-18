import express from "express";
import upload from "../middleware/upload.js";
import Resource from "../models/Resource.js";

const router = express.Router();

// Upload new resource
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const tagArray = tags ? tags.split(",").map(t => t.trim()) : [];

    const resource = new Resource({
      title,
      description,
      tags: tagArray,
      fileUrl,
    });

    await resource.save();
    res.status(201).json({ success: true, resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all resources
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) query = { tags: { $regex: search, $options: "i" } };

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
