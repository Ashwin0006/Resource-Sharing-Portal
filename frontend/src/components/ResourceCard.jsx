import { useState } from "react";
import api from "../api";
import EditResourceForm from "./EditResourceForm";

export default function ResourceCard({ resource, onUpdate, onDelete, showActions = false }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/resources/${resource._id}`);
      onDelete(resource._id);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete resource. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSuccess = (updatedResource) => {
    onUpdate(updatedResource);
    setShowEditForm(false);
  };

  return (
    <>
      <div className="border border-pink-500/30 rounded-xl p-4 shadow-2xl hover:shadow-pink-500/20 bg-black/50 backdrop-blur-md flex flex-col justify-between">
        <h2 className="font-semibold text-lg text-white rcard-title mb-1">{resource.title}</h2>
        <p className="text-orange-300 text-sm mt-1">
          {resource.description || "No description provided"}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {resource.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-400/50 tag"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex justify-between items-center">
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 font-medium hover:text-pink-300 underline transition-colors duration-200"
          >
            View
          </a>
          <div className="text-right">
            <div className="text-xs text-orange-300">
              by {resource.uploadedBy?.username || "Unknown"}
            </div>
            {/* {resource.originalFileName && (
              <div className="text-xs text-yellow-300 truncate max-w-32">
                {resource.originalFileName}
              </div>
            )} */}
          </div>
        </div>

        {showActions && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="edit-btn flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-400/50"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="del-btn flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-lg text-sm hover:from-red-600 hover:to-pink-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-400/50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {showEditForm && (
        <EditResourceForm
          resource={resource}
          onClose={() => setShowEditForm(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
