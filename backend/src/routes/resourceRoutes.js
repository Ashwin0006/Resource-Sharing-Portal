import express from "express";
import upload from "../middleware/upload.js";
import Resource from "../models/Resource.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Upload new resource (protected route)
router.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const tagArray = tags ? tags.split(",").map(t => t.trim()) : [];

    const resource = new Resource({
      title,
      description,
      tags: tagArray,
      fileUrl,
      uploadedBy: req.user._id,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    await resource.save();
    
    // Populate user info
    await resource.populate("uploadedBy", "username email");
    
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

    if (search) {
      // Handle multiple search keywords
      const keywords = search.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
      
      if (keywords.length > 0) {
        // Use AND logic - resources must match ALL keywords
        const keywordRegexes = keywords.map(keyword => new RegExp(keyword, 'i'));
        
        query = {
          $and: [
            {
              $or: [
                { tags: { $in: keywordRegexes } },
                { title: { $in: keywordRegexes } },
                { description: { $in: keywordRegexes } }
              ]
            }
          ]
        };
        
        // For each keyword, ensure it matches at least one field
        keywords.forEach(keyword => {
          const keywordRegex = new RegExp(keyword, 'i');
          query.$and.push({
            $or: [
              { tags: keywordRegex },
              { title: keywordRegex },
              { description: keywordRegex }
            ]
          });
        });
      }
    }

    const resources = await Resource.find(query)
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's own resources
router.get("/my-resources", authenticateToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { uploadedBy: req.user._id };

    if (search) {
      // Handle multiple search keywords for user's resources
      const keywords = search.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
      
      if (keywords.length > 0) {
        // Use AND logic - resources must match ALL keywords
        const keywordRegexes = keywords.map(keyword => new RegExp(keyword, 'i'));
        
        query = {
          uploadedBy: req.user._id,
          $and: [
            {
              $or: [
                { tags: { $in: keywordRegexes } },
                { title: { $in: keywordRegexes } },
                { description: { $in: keywordRegexes } }
              ]
            }
          ]
        };
        
        // For each keyword, ensure it matches at least one field
        keywords.forEach(keyword => {
          const keywordRegex = new RegExp(keyword, 'i');
          query.$and.push({
            $or: [
              { tags: keywordRegex },
              { title: keywordRegex },
              { description: keywordRegex }
            ]
          });
        });
      }
    }

    const resources = await Resource.find(query)
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update resource (only by owner)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const resourceId = req.params.id;

    // Find resource and check ownership
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ 
        success: false, 
        message: "Resource not found" 
      });
    }

    // Check if user owns this resource
    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only edit your own resources" 
      });
    }

    // Update resource
    const tagArray = tags ? tags.split(",").map(t => t.trim()) : [];
    
    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      {
        title,
        description,
        tags: tagArray
      },
      { new: true }
    ).populate("uploadedBy", "username email");

    res.json({ 
      success: true, 
      message: "Resource updated successfully",
      resource: updatedResource 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// Delete resource (only by owner)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const resourceId = req.params.id;

    // Find resource and check ownership
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ 
        success: false, 
        message: "Resource not found" 
      });
    }

    // Check if user owns this resource
    if (resource.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only delete your own resources" 
      });
    }

    // Delete the file from filesystem
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), resource.fileUrl);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileErr) {
      console.error("Error deleting file:", fileErr);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await Resource.findByIdAndDelete(resourceId);

    res.json({ 
      success: true, 
      message: "Resource deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

export default router;
