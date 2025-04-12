import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiSave, FiX, FiUpload, FiPlus, FiTrash } from "react-icons/fi";
import Layout from "../../components/Layout";
import regionService from "../../services/regionService";

const RegionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [areas, setAreas] = useState([]);
  const [features, setFeatures] = useState([]);
  const [elements, setElements] = useState([]);

  // Image preview
  const [iconPreview, setIconPreview] = useState(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch data and region data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data for elements - in a real app, you would fetch these from the API
        setElements([
          { id: 1, elementName: "Pyro", elementColor: "#f44336" },
          { id: 2, elementName: "Hydro", elementColor: "#2196f3" },
          { id: 3, elementName: "Anemo", elementColor: "#4caf50" },
          { id: 4, elementName: "Electro", elementColor: "#9c27b0" },
          { id: 5, elementName: "Dendro", elementColor: "#8bc34a" },
          { id: 6, elementName: "Cryo", elementColor: "#00bcd4" },
          { id: 7, elementName: "Geo", elementColor: "#ff9800" },
        ]);

        // If in edit mode, fetch region data
        if (isEditMode) {
          const regionData = await regionService.getRegionById(id);

          // Set form values for basic fields
          Object.keys(regionData).forEach((key) => {
            if (key !== "areas" && key !== "features" && key !== "characters") {
              setValue(key, regionData[key]);
            }
          });

          // Set areas and features
          if (regionData.areas && regionData.areas.length > 0) {
            setAreas(regionData.areas);
          } else {
            setAreas([{ areaName: "", areaDescription: "", areaImage: null }]);
          }

          if (regionData.features && regionData.features.length > 0) {
            setFeatures(regionData.features);
          } else {
            setFeatures([{ featureName: "", featureDescription: "" }]);
          }

          // Set icon preview
          if (regionData.regionIcon) {
            setIconPreview(regionData.regionIcon);
          }
        } else {
          // Initialize with empty fields
          setAreas([{ areaName: "", areaDescription: "", areaImage: null }]);
          setFeatures([{ featureName: "", featureDescription: "" }]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Process icon file if provided
      if (data.regionIcon && data.regionIcon.length > 0) {
        data.regionIcon = data.regionIcon[0];
      } else {
        delete data.regionIcon;
      }

      // Create or update region
      if (isEditMode) {
        await regionService.updateRegion(id, data);

        // Process areas
        for (const area of areas) {
          if (area.id) {
            // Update existing area (not implemented in service yet)
          } else if (area.areaName.trim()) {
            // Create new area
            await regionService.addRegionArea(id, area);
          }
        }

        // Process features
        for (const feature of features) {
          if (feature.id) {
            // Update existing feature (not implemented in service yet)
          } else if (feature.featureName.trim()) {
            // Create new feature
            await regionService.addRegionFeature(id, feature);
          }
        }

        toast.success("Region updated successfully");
      } else {
        const result = await regionService.createRegion(data);
        const newRegionId = result.region.id;

        // Add areas and features to the new region
        for (const area of areas) {
          if (area.areaName.trim()) {
            await regionService.addRegionArea(newRegionId, area);
          }
        }

        for (const feature of features) {
          if (feature.featureName.trim()) {
            await regionService.addRegionFeature(newRegionId, feature);
          }
        }

        toast.success("Region created successfully");
      }

      // Navigate back to regions list
      navigate("/regions");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle file change for preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle area change
  const handleAreaChange = (index, field, value) => {
    const newAreas = [...areas];
    newAreas[index][field] = value;
    setAreas(newAreas);
  };

  // Add new area
  const addArea = () => {
    setAreas([
      ...areas,
      { areaName: "", areaDescription: "", areaImage: null },
    ]);
  };

  // Remove area
  const removeArea = (index) => {
    const newAreas = [...areas];
    newAreas.splice(index, 1);
    setAreas(newAreas);
  };

  // Handle feature change
  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  // Add new feature
  const addFeature = () => {
    setFeatures([...features, { featureName: "", featureDescription: "" }]);
  };

  // Remove feature
  const removeFeature = (index) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  if (loading) {
    return (
      <Layout title={isEditMode ? "Edit Region" : "Add Region"}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditMode ? "Edit Region" : "Add Region"}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Region" : "Add New Region"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update region information"
            : "Create a new region in Teyvat"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="regionName" className="form-label">
                Region Name
              </label>
              <input
                id="regionName"
                type="text"
                className={`form-input ${
                  errors.regionName ? "border-error" : ""
                }`}
                {...register("regionName", {
                  required: "Region name is required",
                })}
              />
              {errors.regionName && (
                <p className="form-error">{errors.regionName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="mainCity" className="form-label">
                Main City
              </label>
              <input
                id="mainCity"
                type="text"
                className="form-input"
                {...register("mainCity")}
              />
            </div>

            <div>
              <label htmlFor="associatedElement" className="form-label">
                Associated Element
              </label>
              <select
                id="associatedElement"
                className="form-input"
                {...register("associatedElement")}
              >
                <option value="">Select Element</option>
                {elements.map((element) => (
                  <option key={element.id} value={element.elementName}>
                    {element.elementName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="archon" className="form-label">
                Archon
              </label>
              <input
                id="archon"
                type="text"
                className="form-input"
                {...register("archon")}
              />
            </div>

            <div>
              <label htmlFor="ideal" className="form-label">
                Ideal
              </label>
              <input
                id="ideal"
                type="text"
                className="form-input"
                {...register("ideal")}
              />
            </div>

            <div>
              <label htmlFor="controllingEntity" className="form-label">
                Controlling Entity
              </label>
              <input
                id="controllingEntity"
                type="text"
                className="form-input"
                {...register("controllingEntity")}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Description & Lore</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="overview" className="form-label">
                Overview
              </label>
              <textarea
                id="overview"
                rows="4"
                className="form-input"
                {...register("overview")}
              ></textarea>
            </div>

            <div>
              <label htmlFor="archonQuest" className="form-label">
                Archon Quest
              </label>
              <input
                id="archonQuest"
                type="text"
                className="form-input"
                {...register("archonQuest")}
              />
            </div>

            <div>
              <label htmlFor="celebratedFestivals" className="form-label">
                Celebrated Festivals
              </label>
              <textarea
                id="celebratedFestivals"
                rows="3"
                className="form-input"
                {...register("celebratedFestivals")}
              ></textarea>
            </div>

            <div>
              <label htmlFor="howToAccess" className="form-label">
                How to Access
              </label>
              <textarea
                id="howToAccess"
                rows="3"
                className="form-input"
                {...register("howToAccess")}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Region Areas</h2>
          <p className="text-sm text-gray-600 mb-4">
            Define notable locations and areas within the region.
          </p>

          {areas.map((area, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded relative">
              {areas.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArea(index)}
                  className="absolute top-2 right-2 text-error hover:text-red-700"
                >
                  <FiTrash size={16} />
                </button>
              )}

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
                  <label className="form-label">Area Image</label>
                  <input
                    type="file"
                    className="form-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      handleAreaChange(index, "areaImage", file);
                    }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Area Description</label>
                  <textarea
                    rows="3"
                    className="form-input"
                    value={area.areaDescription}
                    onChange={(e) =>
                      handleAreaChange(index, "areaDescription", e.target.value)
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addArea}
            className="btn btn-outline flex items-center mt-2"
          >
            <FiPlus className="mr-2" />
            Add Area
          </button>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Region Features</h2>
          <p className="text-sm text-gray-600 mb-4">
            Define special features, characteristics, or aspects of the region.
          </p>

          {features.map((feature, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded relative">
              {features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="absolute top-2 right-2 text-error hover:text-red-700"
                >
                  <FiTrash size={16} />
                </button>
              )}

              <div className="space-y-3">
                <div>
                  <label className="form-label">Feature Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={feature.featureName}
                    onChange={(e) =>
                      handleFeatureChange(index, "featureName", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Feature Description</label>
                  <textarea
                    rows="3"
                    className="form-input"
                    value={feature.featureDescription}
                    onChange={(e) =>
                      handleFeatureChange(
                        index,
                        "featureDescription",
                        e.target.value
                      )
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFeature}
            className="btn btn-outline flex items-center mt-2"
          >
            <FiPlus className="mr-2" />
            Add Feature
          </button>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Region Icon</h2>

          <div className="flex items-center">
            <div className="flex-shrink-0">
              {iconPreview ? (
                <img
                  src={iconPreview}
                  alt="Region icon preview"
                  className="w-24 h-24 object-cover rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <FiUpload className="text-gray-500" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <input
                id="regionIcon"
                type="file"
                className="hidden"
                accept="image/*"
                {...register("regionIcon")}
                onChange={handleFileChange}
              />
              <label
                htmlFor="regionIcon"
                className="btn btn-outline flex items-center"
              >
                <FiUpload className="mr-2" />
                Choose Icon
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 256x256px, PNG format with transparent background
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/regions")}
            className="btn btn-outline flex items-center"
            disabled={submitting}
          >
            <FiX className="mr-2" />
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary flex items-center"
            disabled={submitting}
          >
            <FiSave className="mr-2" />
            {submitting
              ? "Saving..."
              : isEditMode
              ? "Update Region"
              : "Save Region"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default RegionForm;
