import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    fileUrl: { type: String, required: true },
    uploadedBy: { type: String, default: "Anonymous" },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);
