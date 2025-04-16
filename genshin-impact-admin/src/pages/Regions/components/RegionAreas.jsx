import { FiPlus, FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import regionService from "../../../services/regionService";

const RegionAreas = ({ areas, setAreas, isEditMode, navigate }) => {
  // Handle area change
  const handleAreaChange = (index, field, value) => {
    const newAreas = [...areas];
    newAreas[index][field] = value;
    setAreas(newAreas);
  };

  // Add new area
  const addArea = () => {
    setAreas([...areas, { areaName: "", areaDescription: "", areaImage: "" }]);
  };

  // Remove area
  const removeArea = (index) => {
    const newAreas = [...areas];
    newAreas.splice(index, 1);
    setAreas(newAreas);
  };

  // Delete existing area (for areas that have an ID)
  const deleteArea = async (areaId) => {
    if (window.confirm("Are you sure you want to delete this area?")) {
      try {
        await regionService.deleteArea(areaId);
        toast.success("Area deleted successfully");

        // Update the areas list
        setAreas(areas.filter((area) => area.id !== areaId));
      } catch (error) {
        console.error("Error deleting area:", error);
        toast.error("Failed to delete area");
      }
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Region Areas</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={addArea}
            className="btn btn-primary btn-sm flex items-center"
          >
            <FiPlus className="mr-1" />
            Add Area
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={() => navigate("/regions/trash")}
              className="btn btn-outline btn-sm flex items-center"
            >
              <FiTrash className="mr-1" />
              Trash
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Define notable locations and areas within the region.
      </p>

      {areas.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-md">
          <p className="text-gray-500">No areas added yet.</p>
          <button
            type="button"
            onClick={addArea}
            className="btn btn-primary btn-sm mt-2"
          >
            <FiPlus className="mr-1" />
            Add First Area
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {areas.map((area, index) => (
            <div
              key={area.id || index}
              className="p-4 border rounded-md relative hover:shadow-sm transition-shadow"
            >
              <button
                type="button"
                onClick={() =>
                  area.id ? deleteArea(area.id) : removeArea(index)
                }
                className="absolute top-2 right-2 text-error hover:text-red-700"
              >
                <FiTrash size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Area Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={area.areaName}
                    onChange={(e) =>
                      handleAreaChange(index, "areaName", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Area Image URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={area.areaImage || ""}
                    onChange={(e) =>
                      handleAreaChange(index, "areaImage", e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Area Description</label>
                  <textarea
                    rows="3"
                    className="form-input"
                    value={area.areaDescription || ""}
                    onChange={(e) =>
                      handleAreaChange(index, "areaDescription", e.target.value)
                    }
                  ></textarea>
                </div>

                {area.areaImage && (
                  <div className="md:col-span-2">
                    <label className="form-label">Image Preview</label>
                    <div className="mt-1">
                      <img
                        src={area.areaImage}
                        alt={area.areaName}
                        className="max-h-40 rounded-md border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x150?text=Image+Not+Found";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionAreas;
