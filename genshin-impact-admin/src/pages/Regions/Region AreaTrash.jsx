import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiRefreshCw, FiTrash2, FiArrowLeft } from "react-icons/fi";
import Layout from "../../components/Layout";
import regionService from "../../services/regionService";

const RegionAreaTrash = () => {
  const [deletedAreas, setDeletedAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch deleted areas
  const fetchDeletedAreas = async () => {
    setLoading(true);
    try {
      const data = await regionService.getDeletedAreas();
      setDeletedAreas(data);
    } catch (error) {
      console.error("Error fetching deleted areas:", error);
      toast.error("Failed to load deleted areas");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDeletedAreas();
  }, []);

  // Restore area
  const handleRestore = async (areaId) => {
    try {
      await regionService.restoreArea(areaId);
      toast.success("Area restored successfully");
      fetchDeletedAreas(); // Refresh the list
    } catch (error) {
      console.error("Error restoring area:", error);
      toast.error("Failed to restore area");
    }
  };

  // Permanently delete area
  const handlePermanentDelete = async (areaId) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this area? This action cannot be undone."
      )
    ) {
      try {
        await regionService.deleteAreaPermanently(areaId);
        toast.success("Area permanently deleted");
        fetchDeletedAreas(); // Refresh the list
      } catch (error) {
        console.error("Error permanently deleting area:", error);
        toast.error("Failed to permanently delete area");
      }
    }
  };

  return (
    <Layout title="Deleted Region Areas">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Deleted Region Areas</h1>
          <p className="text-gray-600">Manage deleted areas from regions</p>
        </div>

        <div className="flex space-x-4">
          <Link to="/regions" className="btn btn-outline flex items-center">
            <FiArrowLeft className="mr-2" />
            Back to Regions
          </Link>
          <button
            onClick={fetchDeletedAreas}
            className="btn btn-primary flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : deletedAreas.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="text-gray-500">No deleted areas found</p>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-gray-700 bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Area Name</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Deleted At</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedAreas.map((area) => (
                  <tr key={area.id} className="border-b">
                    <td className="px-4 py-3">{area.areaName}</td>
                    <td className="px-4 py-3">
                      {area.region?.regionName || "Unknown"}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(area.deletedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 flex space-x-2">
                      <button
                        onClick={() => handleRestore(area.id)}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center text-xs"
                      >
                        <FiRefreshCw className="mr-1" /> Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(area.id)}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition flex items-center text-xs"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default RegionAreaTrash;
