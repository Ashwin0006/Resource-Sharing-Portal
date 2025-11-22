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
      setMessage("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-black/50 backdrop-blur-md shadow-2xl rounded-3xl p-8 text-center border border-pink-500/30">
        <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Upload Resource</h1>
        <p className="text-white">Please login to upload resources.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-black/50 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-pink-500/30">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">Upload Resource</h1>
        <p className="text-orange-300">Uploading as <span className="font-semibold text-pink-400">{user?.username}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <div className="relative">
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 resize-none"
            rows="3"
          ></textarea>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="relative">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-3 rounded-xl bg-purple-900/50 backdrop-blur-sm border border-orange-500/50 text-white file:bg-pink-500 file:text-white file:border-none file:rounded-lg file:px-3 file:py-1 file:mr-3 file:hover:bg-pink-600 transition-all duration-300"
            required
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg border border-pink-400/50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && (
        <p className="text-center mt-6 text-white font-medium bg-green-500/20 p-2 rounded-lg border border-green-400/50">{message}</p>
      )}
    </div>
  );
}
