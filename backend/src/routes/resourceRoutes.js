import express from "express";
import upload from "../middleware/upload.js";
import Resource from "../models/Resource.js";
import { authenticateToken } from "../middleware/auth.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

/* ============================================================= 
   📌 Upload Resource (Authenticated)
   Supports: PDF, Images, Docs, ZIP — stored in Cloudinary
============================================================= */
router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, description, tags } = req.body;

      if (!req.file || !req.file.secure_url) {
        return res.status(400).json({
          success: false,
          message: "File upload failed",
        });
      }

      const tagArray = tags
        ? tags.split(",").map((tag) => tag.trim().toLowerCase())
        : [];

      const resource = await Resource.create({
        title,
        description,
        tags: tagArray,
        fileUrl: req.file.secure_url, // FIXED — Always valid HTTPS URL
        cloudinaryId: req.file.filename, // For deletion later
        uploadedBy: req.user._id,
        mimeType: req.file.mimetype,
        originalFileName: req.file.originalname,
        fileSize: req.file.size,
      });

      await resource.populate("uploadedBy", "username email");

      res.status(201).json({
        success: true,
        message: "Resource uploaded successfully",
        resource,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* ============================================================= 
   📌 Get All Public Resources
============================================================= */
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const keywords = search
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0)
        .map((keyword) => new RegExp(keyword, "i"));

      query.tags = { $in: keywords };
    }

    const resources = await Resource.find(query)
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================= 
   📌 Get Logged-in User's Resources
============================================================= */
router.get("/my-resources", authenticateToken, async (req, res) => {
  try {
    const resources = await Resource.find({ uploadedBy: req.user._id })
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================= 
   📌 Update Resource
============================================================= */
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource)
      return res.status(404).json({ success: false, message: "Resource not found" });

    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own resources",
      });
    }

    const updated = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        tags: tags
          ? tags.split(",").map((tag) => tag.trim().toLowerCase())
          : resource.tags,
      },
      { new: true }
    ).populate("uploadedBy", "username email");

    res.json({
      success: true,
      message: "Resource updated successfully",
      resource: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================= 
   📌 Delete Resource (Cloudinary + MongoDB)
============================================================= */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource)
      return res.status(404).json({ success: false, message: "Resource not found" });

    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own resources",
      });
    }

    // Remove file from Cloudinary
    await cloudinary.uploader.destroy(resource.cloudinaryId, {
      resource_type: "auto",
    });

    // Remove DB entry
    await Resource.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
