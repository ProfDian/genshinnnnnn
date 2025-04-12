import { useState, useEffect } from "react";
import api from "../../services/api";
import RegionCard from "../../components/cards/RegionCard";
import SearchBar from "../../components/common/SearchBar";
import Loader from "../../components/common/Loader";

const RegionList = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/regions");
        console.log(response.data.regions);
        setRegions(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching regions:", err);
        setError("Failed to load regions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const handleSearch = (searchQuery) => {
    setSearch(searchQuery);
  };

  const filteredRegions = regions.filter((region) =>
    region.regionName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Regions of Teyvat</h1>

      {/* Search */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Region Grid */}
      {filteredRegions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400">
            No regions found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default RegionList;
