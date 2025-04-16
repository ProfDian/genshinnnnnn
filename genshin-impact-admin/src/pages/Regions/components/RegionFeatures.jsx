import { FiPlus } from "react-icons/fi";

const RegionFeatures = ({ features, setFeatures }) => {
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

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Region Features</h2>
        <button
          type="button"
          onClick={addFeature}
          className="btn btn-primary btn-sm flex items-center"
        >
          <FiPlus className="mr-1" />
          Add Feature
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Define special features, characteristics, or aspects of the region.
      </p>

      {features.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-md">
          <p className="text-gray-500">No features added yet.</p>
          <button
            type="button"
            onClick={addFeature}
            className="btn btn-primary btn-sm mt-2"
          >
            <FiPlus className="mr-1" />
            Add First Feature
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              key={feature.id || index}
              className="p-4 border rounded-md relative hover:shadow-sm transition-shadow"
            >
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
                    value={feature.featureDescription || ""}
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
        </div>
      )}
    </div>
  );
};

export default RegionFeatures;
