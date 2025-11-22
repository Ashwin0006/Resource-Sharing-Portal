import { useState, useEffect } from "react";
import api from "../api";

export default function EditResourceForm({ resource, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title || "",
        description: resource.description || "",
        tags: resource.tags ? resource.tags.join(", ") : ""
      });
    }
  }, [resource]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setMessage("Title is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.put(`/resources/${resource._id}`, formData);
      setMessage("✅ Resource updated successfully!");
      onSuccess(response.data.resource);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage("❌ Failed to update resource. Please try again.");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!resource) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/80 backdrop-blur-md rounded-3xl p-8 w-full max-w-md mx-4 border border-pink-500/30 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Edit Resource</h2>
          <button
            onClick={onClose}
            className="text-orange-300 hover:text-yellow-300 text-3xl transition-colors duration-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-orange-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., javascript, react, tutorial"
              className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-500/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg border border-pink-400/50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

        {message && (
          <p className={`text-center mt-6 font-medium p-2 rounded-lg border ${
            message.includes("✅") ? "text-green-300 bg-green-500/20 border-green-400/50" : "text-red-300 bg-red-500/20 border-red-400/50"
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
