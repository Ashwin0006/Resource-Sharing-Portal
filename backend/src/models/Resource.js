import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    fileUrl: { type: String, required: true },
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    originalFileName: { type: String, required: true },
    fileSize: { type: Number },
    mimeType: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
