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
      <div className="border rounded-xl p-4 shadow hover:shadow-md bg-white">
        <h2 className="font-semibold text-lg">{resource.title}</h2>
        <p className="text-gray-600 text-sm mt-1">
          {resource.description || "No description provided"}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {resource.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex justify-between items-center">
          <a
            href={`http://localhost:5000${resource.fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium hover:underline"
          >
            View / Download
          </a>
          <div className="text-right">
            <div className="text-xs text-gray-500">
              by {resource.uploadedBy?.username || "Unknown"}
            </div>
            {resource.originalFileName && (
              <div className="text-xs text-gray-400 truncate max-w-32">
                {resource.originalFileName}
              </div>
            )}
          </div>
        </div>

        {showActions && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
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
