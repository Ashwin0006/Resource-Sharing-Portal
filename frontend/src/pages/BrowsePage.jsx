import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import ResourceCard from "../components/ResourceCard";
import MultiSearch from "../components/MultiSearch";
import api from "../api";

export default function BrowsePage() {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchResources = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/resources?search=${query}`);
      setResources(res.data);
    } catch (err) {
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    fetchResources(query);
  }, [fetchResources]);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">Browse Resources</h1>
        {isAuthenticated && (
          <p className="text-orange-300">
            Welcome back, <span className="font-semibold text-pink-400">{user?.username}</span>!
          </p>
        )}
      </div>

      {/* Multi-Keyword Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <MultiSearch
          onSearch={handleSearch}
          placeholder="Search by keywords"
        />
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <p className="text-center text-white">Loading resources...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <ResourceCard
              key={res._id}
              resource={res}
              showActions={false}
            />
          ))}
        </div>
      )}

      {!loading && resources.length === 0 && (
        <div className="text-center text-white mt-4">
          {searchQuery ? (
            <p>No resources found matching your search criteria.</p>
          ) : (
            <p>No resources found.</p>
          )}
        </div>
      )}

      {!loading && resources.length > 0 && searchQuery && (
        <div className="text-center text-white mt-4">
          <p>Found {resources.length} resource{resources.length !== 1 ? 's' : ''} matching your search.</p>
        </div>
      )}
    </div>
  );
}
