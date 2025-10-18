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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Resource</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., javascript, react, tutorial"
              className="border p-2 rounded-lg w-full"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

        {message && (
          <p className={`text-center mt-4 font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
