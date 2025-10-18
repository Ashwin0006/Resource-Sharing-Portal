import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import ResourceCard from "../components/ResourceCard";
import MultiSearch from "../components/MultiSearch";
import api from "../api";

export default function MyResourcesPage() {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchResources = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/resources/my-resources?search=${query}`);
      setResources(res.data);
    } catch (err) {
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchResources();
    }
  }, [isAuthenticated, fetchResources]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    fetchResources(query);
  }, [fetchResources]);

  const handleResourceUpdate = (updatedResource) => {
    setResources(resources.map(res => 
      res._id === updatedResource._id ? updatedResource : res
    ));
  };

  const handleResourceDelete = (resourceId) => {
    setResources(resources.filter(res => res._id !== resourceId));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto mt-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">My Resources</h1>
        <p className="text-gray-600">Please login to view your resources.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Resources</h1>

      {/* Multi-Keyword Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <MultiSearch
          onSearch={handleSearch}
          placeholder="Search your resources (must match ALL keywords)..."
        />
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <p className="text-center text-gray-500">Loading resources...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <ResourceCard
              key={res._id}
              resource={res}
              onUpdate={handleResourceUpdate}
              onDelete={handleResourceDelete}
              showActions={true}
            />
          ))}
        </div>
      )}

      {!loading && resources.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          {searchQuery ? (
            <p>No resources found matching your search criteria.</p>
          ) : (
            <p>No resources found.</p>
          )}
        </div>
      )}

      {!loading && resources.length > 0 && searchQuery && (
        <div className="text-center text-gray-600 mt-4">
          <p>Found {resources.length} resource{resources.length !== 1 ? 's' : ''} matching your search.</p>
        </div>
      )}
    </div>
  );
}
