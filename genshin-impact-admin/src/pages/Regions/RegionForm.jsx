import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiSave, FiX, FiMapPin, FiFeather, FiUsers } from "react-icons/fi";
import Layout from "../../components/Layout";
import regionService from "../../services/regionService";

// Imported sub-components
import RegionGeneralInfo from "./components/RegionGeneralInfo";
import RegionAreas from "./components/RegionAreas";
import RegionFeatures from "./components/RegionFeatures";
import RegionCharacters from "./components/RegionCharacters";

const RegionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [areas, setAreas] = useState([]);
  const [features, setFeatures] = useState([]);
  const [elements, setElements] = useState([]);
  const [iconPreview, setIconPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // "info", "areas", "features", or "characters"

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
            setAreas([{ areaName: "", areaDescription: "", areaImage: "" }]);
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
          setAreas([{ areaName: "", areaDescription: "", areaImage: "" }]);
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
          try {
            if (area.id) {
              // Update existing area
              await regionService.updateRegionArea(area.id, {
                areaName: area.areaName,
                areaDescription: area.areaDescription,
                areaImage: area.areaImage,
              });
            } else if (area.areaName.trim()) {
              // Create new area
              await regionService.addRegionArea(id, area);
            }
          } catch (error) {
            console.error("Error processing area:", error);
            toast.error(`Failed to save area: ${area.areaName}`);
          }
        }

        // Process features
        for (const feature of features) {
          try {
            if (feature.id) {
              // Update existing feature
              await regionService.updateRegionFeature(feature.id, {
                featureName: feature.featureName,
                featureDescription: feature.featureDescription,
              });
            } else if (feature.featureName.trim()) {
              // Create new feature
              await regionService.addRegionFeature(id, feature);
            }
          } catch (error) {
            console.error("Error processing feature:", error);
            toast.error(`Failed to save feature: ${feature.featureName}`);
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

        // For new region creation, navigate to edit page
        if (!isEditMode) {
          navigate(`/regions/edit/${newRegionId}`);
        }
      }
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

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "info"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setActiveTab("info")}
          >
            General Information
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "areas"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setActiveTab("areas")}
          >
            <FiMapPin className="inline mr-2" />
            Areas
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "features"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setActiveTab("features")}
          >
            <FiFeather className="inline mr-2" />
            Features
          </button>
          {isEditMode && (
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "characters"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
              onClick={() => setActiveTab("characters")}
            >
              <FiUsers className="inline mr-2" />
              Characters
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {activeTab === "info" && (
          <RegionGeneralInfo
            register={register}
            errors={errors}
            iconPreview={iconPreview}
            handleFileChange={handleFileChange}
            elements={elements}
          />
        )}

        {activeTab === "areas" && (
          <RegionAreas
            areas={areas}
            setAreas={setAreas}
            isEditMode={isEditMode}
            navigate={navigate}
          />
        )}

        {activeTab === "features" && (
          <RegionFeatures features={features} setFeatures={setFeatures} />
        )}

        {activeTab === "characters" && isEditMode && (
          <RegionCharacters regionId={id} />
        )}

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
