import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiSave, FiX, FiUpload } from "react-icons/fi";
import Layout from "../../components/Layout";
import characterService from "../../services/characterService";

const CharacterForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [elements, setElements] = useState([]);
  const [weaponTypes, setWeaponTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [rarities, setRarities] = useState([]);

  // Image previews
  const [iconPreview, setIconPreview] = useState(null);
  const [gachaImgPreview, setGachaImgPreview] = useState(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch data for dropdowns and character data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data for dropdowns - in a real app, you would fetch these from the API
        setElements([
          { id: 1, elementName: "Pyro", elementColor: "#f44336" },
          { id: 2, elementName: "Hydro", elementColor: "#2196f3" },
          { id: 3, elementName: "Anemo", elementColor: "#4caf50" },
          { id: 4, elementName: "Electro", elementColor: "#9c27b0" },
          { id: 5, elementName: "Dendro", elementColor: "#8bc34a" },
          { id: 6, elementName: "Cryo", elementColor: "#00bcd4" },
          { id: 7, elementName: "Geo", elementColor: "#ff9800" },
        ]);

        setWeaponTypes([
          { id: 1, weaponTypeName: "Sword" },
          { id: 2, weaponTypeName: "Claymore" },
          { id: 3, weaponTypeName: "Polearm" },
          { id: 4, weaponTypeName: "Catalyst" },
          { id: 5, weaponTypeName: "Bow" },
        ]);

        setRegions([
          { id: 1, regionName: "Mondstadt" },
          { id: 2, regionName: "Liyue" },
          { id: 3, regionName: "Inazuma" },
          { id: 4, regionName: "Sumeru" },
          { id: 5, regionName: "Fontaine" },
        ]);

        setRarities([
          { id: 1, rarityValue: 4, rarityColor: "#a256e1" },
          { id: 2, rarityValue: 5, rarityColor: "#bd6932" },
        ]);

        // If in edit mode, fetch character data
        if (isEditMode) {
          const characterData = await characterService.getCharacterById(id);

          // Set form values
          Object.keys(characterData).forEach((key) => {
            if (
              key !== "element" &&
              key !== "weaponType" &&
              key !== "region" &&
              key !== "rarity"
            ) {
              setValue(key, characterData[key]);
            }
          });

          // Set dropdown values
          setValue("elementId", characterData.elementId);
          setValue("weaponTypeId", characterData.weaponTypeId);
          setValue("regionId", characterData.regionId);
          setValue("rarityId", characterData.rarityId);

          // Set image previews
          if (characterData.icon) {
            setIconPreview(characterData.icon);
          }

          if (characterData.gachaImg) {
            setGachaImgPreview(characterData.gachaImg);
          }
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
      // Add files to data if they exist
      if (data.icon && data.icon.length > 0) {
        data.icon = data.icon[0];
      } else {
        delete data.icon;
      }

      if (data.gachaImg && data.gachaImg.length > 0) {
        data.gachaImg = data.gachaImg[0];
      } else {
        delete data.gachaImg;
      }

      // Convert string values to appropriate types
      if (data.elementId) data.elementId = parseInt(data.elementId);
      if (data.weaponTypeId) data.weaponTypeId = parseInt(data.weaponTypeId);
      if (data.regionId) data.regionId = parseInt(data.regionId);
      if (data.rarityId) data.rarityId = parseInt(data.rarityId);

      if (isEditMode) {
        await characterService.updateCharacter(id, data);
        toast.success("Character updated successfully");
      } else {
        await characterService.createCharacter(data);
        toast.success("Character created successfully");
      }

      // Navigate back to characters list
      navigate("/characters");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle file changes for preview
  const handleFileChange = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Layout title={isEditMode ? "Edit Character" : "Add Character"}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditMode ? "Edit Character" : "Add Character"}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Character" : "Add New Character"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update character information"
            : "Create a new character"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="id" className="form-label">
                ID
              </label>
              <input
                id="id"
                type="number"
                className={`form-input ${errors.id ? "border-error" : ""}`}
                disabled={isEditMode}
                {...register("id", { required: "ID is required" })}
              />
              {errors.id && <p className="form-error">{errors.id.message}</p>}
            </div>

            <div>
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name ? "border-error" : ""}`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                id="title"
                type="text"
                className="form-input"
                {...register("title")}
              />
            </div>

            <div>
              <label htmlFor="constellation" className="form-label">
                Constellation
              </label>
              <input
                id="constellation"
                type="text"
                className="form-input"
                {...register("constellation")}
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="detail" className="form-label">
              Description
            </label>
            <textarea
              id="detail"
              rows="4"
              className="form-input"
              {...register("detail")}
            ></textarea>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Attributes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="elementId" className="form-label">
                Element
              </label>
              <select
                id="elementId"
                className={`form-input ${
                  errors.elementId ? "border-error" : ""
                }`}
                {...register("elementId")}
              >
                <option value="">Select Element</option>
                {elements.map((element) => (
                  <option key={element.id} value={element.id}>
                    {element.elementName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="weaponTypeId" className="form-label">
                Weapon Type
              </label>
              <select
                id="weaponTypeId"
                className={`form-input ${
                  errors.weaponTypeId ? "border-error" : ""
                }`}
                {...register("weaponTypeId")}
              >
                <option value="">Select Weapon Type</option>
                {weaponTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.weaponTypeName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="regionId" className="form-label">
                Region
              </label>
              <select
                id="regionId"
                className="form-input"
                {...register("regionId")}
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.regionName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rarityId" className="form-label">
                Rarity
              </label>
              <select
                id="rarityId"
                className={`form-input ${
                  errors.rarityId ? "border-error" : ""
                }`}
                {...register("rarityId")}
              >
                <option value="">Select Rarity</option>
                {rarities.map((rarity) => (
                  <option key={rarity.id} value={rarity.id}>
                    {rarity.rarityValue} Star
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthday" className="form-label">
                Birthday
              </label>
              <input
                id="birthday"
                type="text"
                className="form-input"
                placeholder="MM/DD"
                {...register("birthday")}
              />
            </div>

            <div>
              <label htmlFor="releaseDate" className="form-label">
                Release Date
              </label>
              <input
                id="releaseDate"
                type="number"
                className="form-input"
                placeholder="Unix timestamp"
                {...register("releaseDate")}
              />
            </div>

            <div>
              <label htmlFor="native" className="form-label">
                Native Name
              </label>
              <input
                id="native"
                type="text"
                className="form-input"
                {...register("native")}
              />
            </div>
          </div>

          <h3 className="text-md font-medium mt-4 mb-2">Voice Actors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cvEn" className="form-label">
                English
              </label>
              <input
                id="cvEn"
                type="text"
                className="form-input"
                {...register("cvEn")}
              />
            </div>

            <div>
              <label htmlFor="cvJp" className="form-label">
                Japanese
              </label>
              <input
                id="cvJp"
                type="text"
                className="form-input"
                {...register("cvJp")}
              />
            </div>

            <div>
              <label htmlFor="cvChs" className="form-label">
                Chinese
              </label>
              <input
                id="cvChs"
                type="text"
                className="form-input"
                {...register("cvChs")}
              />
            </div>

            <div>
              <label htmlFor="cvKr" className="form-label">
                Korean
              </label>
              <input
                id="cvKr"
                type="text"
                className="form-input"
                {...register("cvKr")}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Images</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Character Icon</label>
              <div className="mt-2 flex items-center">
                <div className="flex-shrink-0">
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Character icon preview"
                      className="w-24 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded bg-gray-200 flex items-center justify-center">
                      <FiUpload className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <input
                    id="icon"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    {...register("icon")}
                    onChange={(e) => handleFileChange(e, setIconPreview)}
                  />
                  <label
                    htmlFor="icon"
                    className="btn btn-outline flex items-center"
                  >
                    <FiUpload className="mr-2" />
                    Choose Icon
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 256x256px, PNG format
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Gacha Image</label>
              <div className="mt-2 flex items-center">
                <div className="flex-shrink-0">
                  {gachaImgPreview ? (
                    <img
                      src={gachaImgPreview}
                      alt="Gacha image preview"
                      className="w-24 h-36 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-36 rounded bg-gray-200 flex items-center justify-center">
                      <FiUpload className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <input
                    id="gachaImg"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    {...register("gachaImg")}
                    onChange={(e) => handleFileChange(e, setGachaImgPreview)}
                  />
                  <label
                    htmlFor="gachaImg"
                    className="btn btn-outline flex items-center"
                  >
                    <FiUpload className="mr-2" />
                    Choose Gacha Image
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: Portrait orientation, PNG format
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/characters")}
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
              ? "Update Character"
              : "Save Character"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default CharacterForm;
