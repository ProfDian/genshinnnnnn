import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiPlus, FiEdit, FiMapPin, FiUsers, FiSearch } from "react-icons/fi";
import Layout from "../../components/Layout";
import regionService from "../../services/regionService";

const RegionList = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered regions based on search
  const filteredRegions = regions.filter((region) =>
    region.regionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch regions
  const fetchRegions = async () => {
    setLoading(true);
    try {
      const data = await regionService.getAllRegions();
      setRegions(data);
    } catch (error) {
      console.error("Error fetching regions:", error);
      toast.error("Failed to load regions");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRegions();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Region card component
  const RegionCard = ({ region }) => (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {region.regionIcon ? (
          <img
            src={region.regionIcon}
            alt={region.regionName}
            className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 md:mb-0 md:mr-4">
            <FiMapPin size={32} className="text-gray-500" />
          </div>
        )}
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-lg font-semibold">{region.regionName}</h2>

          {region.associatedElement && (
            <p className="text-sm mb-2">
              <span className="text-gray-600">Element:</span>{" "}
              {region.associatedElement}
            </p>
          )}

          {region.archon && (
            <p className="text-sm mb-2">
              <span className="text-gray-600">Archon:</span> {region.archon}
            </p>
          )}

          {region.mainCity && (
            <p className="text-sm mb-2">
              <span className="text-gray-600">Main City:</span>{" "}
              {region.mainCity}
            </p>
          )}

          <div className="flex flex-wrap mt-2 gap-2 justify-center md:justify-start">
            <div className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center">
              <FiMapPin className="mr-1" /> {region.areas?.length || 0} Areas
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center">
              <FiUsers className="mr-1" /> {region.characters?.length || 0}{" "}
              Characters
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 md:ml-4 flex flex-col space-y-2">
          <Link
            to={`/regions/edit/${region.id}`}
            className="btn btn-primary px-3 py-1 text-sm flex items-center justify-center"
          >
            <FiEdit className="mr-1" /> Edit
          </Link>
          <Link
            to={`/regions/${region.id}`}
            className="btn btn-outline px-3 py-1 text-sm flex items-center justify-center"
          >
            View Details
          </Link>
        </div>
      </div>

      {region.overview && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">
            {region.overview}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Layout title="Regions">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Region Management</h1>
          <p className="text-gray-600">Manage all regions in Teyvat</p>
        </div>

        <Link
          to="/regions/create"
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Region
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search regions..."
            className="form-input pl-10 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredRegions.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="text-gray-500">No regions found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredRegions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default RegionList;
