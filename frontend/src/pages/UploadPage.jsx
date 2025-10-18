import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setMessage("Please provide a title and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await api.post("/resources/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Upload successful!");
      setTitle("");
      setDescription("");
      setTags("");
      setFile(null);
    } catch (err) {
      setMessage("❌ Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Upload Resource</h1>
        <p className="text-gray-600">Please login to upload resources.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Upload Resource</h1>
        <p className="text-gray-600">Uploading as <span className="font-semibold text-blue-600">{user?.username}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded-lg"
          required
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-lg resize-none"
          rows="3"
        ></textarea>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && (
        <p className="text-center mt-4 text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
}
