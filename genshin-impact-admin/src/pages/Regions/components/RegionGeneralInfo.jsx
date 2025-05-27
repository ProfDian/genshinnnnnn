import { FiUpload } from "react-icons/fi";

const RegionGeneralInfo = ({
  register,
  errors,
  iconPreview,
  handleFileChange,
  elements,
}) => {
  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div>
            <label htmlFor="regionName" className="form-label">
              Region Name <span className="text-error">*</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Region Icon */}
          <div className="mt-6">
            <h3 className="form-label">Region Icon</h3>
            <div className="flex items-center mt-2">
              <div className="flex-shrink-0">
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt="Region icon preview"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUpload className="text-gray-500" />
                  </div>
                )}
              </div>
              <div className="ml-4 flex-grow">
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
                  className="btn btn-outline btn-sm flex items-center"
                >
                  <FiUpload className="mr-2" />
                  Choose Icon
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG format with transparent background
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Description & Lore */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Description & Lore</h2>

          <div>
            <label htmlFor="overview" className="form-label">
              Overview
            </label>
            <textarea
              id="overview"
              rows="3"
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
    </div>
  );
};

export default RegionGeneralInfo;
