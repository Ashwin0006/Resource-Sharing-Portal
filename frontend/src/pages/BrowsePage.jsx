import { useEffect, useState } from "react";
import api from "../api";

export default function BrowsePage() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResources = async (query = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/resources?search=${query}`);
      setResources(res.data);
    } catch (err) {
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources(search);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Resources</h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex gap-2 justify-center mb-8"
      >
        <input
          type="text"
          placeholder="Search by tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-1/2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Loading Indicator */}
      {loading ? (
        <p className="text-center text-gray-500">Loading resources...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res._id}
              className="border rounded-xl p-4 shadow hover:shadow-md bg-white"
            >
              <h2 className="font-semibold text-lg">{res.title}</h2>
              <p className="text-gray-600 text-sm mt-1">
                {res.description || "No description provided"}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {res.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={`http://localhost:5000${res.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 mt-3 font-medium hover:underline"
              >
                View / Download
              </a>
            </div>
          ))}
        </div>
      )}

      {!loading && resources.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No resources found.</p>
      )}
    </div>
  );
}
