import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEdit,
  FiMapPin,
  FiUsers,
  FiSearch,
  FiTrash,
  FiEye,
} from "react-icons/fi";
import Layout from "../../components/Layout";
import regionService from "../../services/regionService";
import RegionCard from "./RegionCard";

const RegionList = () => {
  const navigate = useNavigate();
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

  return (
    <Layout title="Regions">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Region Management</h1>
          <p className="text-gray-600">Manage all regions in Teyvat</p>
        </div>

        <div className="flex space-x-3">
          <Link
            to="/regions/trash"
            className="btn btn-outline flex items-center"
          >
            <FiTrash className="mr-2" />
            Trash
          </Link>
          <Link
            to="/regions/create"
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            Add Region
          </Link>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default RegionList;
