// WeaponForm.jsx - Update untuk menggunakan service dengan benar
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiSave, FiX, FiUpload, FiPlus, FiTrash } from "react-icons/fi";
import Layout from "../../components/Layout";
import weaponService from "../../services/weaponService";
import weaponStatService from "../../services/weaponStatService";
import referenceDataService from "../../services/referenceDataService";

const WeaponForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [weaponTypes, setWeaponTypes] = useState([]);
  const [rarities, setRarities] = useState([]);
  const [substatTypes, setSubstatTypes] = useState([]);
  const [previewStats, setPreviewStats] = useState([]);

  // For passives and refinements
  const [passives, setPassives] = useState([
    { passiveName: "", passiveDescription: "" },
  ]);
  const [refinements, setRefinements] = useState([
    { refinementLevel: 1, refinementDescription: "" },
    { refinementLevel: 2, refinementDescription: "" },
    { refinementLevel: 3, refinementDescription: "" },
    { refinementLevel: 4, refinementDescription: "" },
    { refinementLevel: 5, refinementDescription: "" },
  ]);

  // Image preview
  const [iconPreview, setIconPreview] = useState(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      weapon: {
        name: "",
        description: "",
        weaponTypeId: "",
        rarityId: "",
        specialProperty: "",
        story: "",
      },
      stats: {
        weaponType: "",
        substatType: "",
        substatValue: "",
      },
    },
  });

  // Watch form values for preview stats
  const watchWeaponType = watch("stats.weaponType");
  const watchSubstatType = watch("stats.substatType");
  const watchSubstatValue = watch("stats.substatValue");

  // Fetch data for dropdowns and weapon data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get weapon types from weaponStatService
        const weaponTypesData = await weaponStatService.getWeaponTypes();
        setWeaponTypes(weaponTypesData);

        // Get substat types from weaponStatService
        const substatTypesData = await weaponStatService.getSubstatTypes();
        setSubstatTypes(substatTypesData);

        // Get rarities from referenceDataService
        const raritiesData = await referenceDataService.getAllRarities();
        setRarities(raritiesData);

        // If in edit mode, fetch weapon data
        if (isEditMode) {
          const weaponData = await weaponService.getWeaponById(id);

          // Set weapon basic info
          setValue("weapon.name", weaponData.name);
          setValue("weapon.description", weaponData.description);
          setValue("weapon.weaponTypeId", weaponData.weaponTypeId);
          setValue("weapon.rarityId", weaponData.rarityId);
          setValue("weapon.specialProperty", weaponData.specialProperty);
          setValue("weapon.story", weaponData.story);

          // Set passives if they exist
          if (weaponData.passives && weaponData.passives.length > 0) {
            setPassives(weaponData.passives);
          }

          // Set refinements if they exist
          if (weaponData.refinements && weaponData.refinements.length > 0) {
            setRefinements(weaponData.refinements);
          }

          // Set icon preview
          if (weaponData.icon) {
            setIconPreview(weaponData.icon);
          }

          // Get weapon stats for this weapon
          const statsData = await weaponStatService.getWeaponStats(id);

          if (statsData.length > 0) {
            // Find base stat (level 1, ascension 0)
            const baseStat = statsData.find(
              (stat) => stat.level === 1 && stat.ascension === 0
            );

            if (baseStat) {
              // Find weapon type from base_atk
              const matchingType = weaponTypesData.find(
                (type) => Math.abs(type.baseATK - baseStat.base_atk) < 1
              );

              if (matchingType) {
                setValue("stats.weaponType", matchingType.value);
              }

              // Set substat type and value if they exist
              if (baseStat.substat_type && baseStat.sub_stat_value) {
                setValue("stats.substatType", baseStat.substat_type);
                setValue("stats.substatValue", baseStat.sub_stat_value);
              }
            }
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

  // Update preview stats when weapon type or substat changes
  useEffect(() => {
    const generatePreviewStats = async () => {
      if (watchWeaponType) {
        try {
          const previewData = {
            weaponType: watchWeaponType,
            substatType: watchSubstatType || null,
            substatValue: watchSubstatValue
              ? parseFloat(watchSubstatValue)
              : null,
          };

          const data = await weaponStatService.previewWeaponStats(previewData);
          setPreviewStats(data);
        } catch (error) {
          console.error("Error generating preview stats:", error);
        }
      } else {
        setPreviewStats([]);
      }
    };

    generatePreviewStats();
  }, [watchWeaponType, watchSubstatType, watchSubstatValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add weapon basic data
      Object.keys(data.weapon).forEach((key) => {
        formData.append(`weapon[${key}]`, data.weapon[key]);
      });

      // Add stats data
      if (data.stats.weaponType) {
        Object.keys(data.stats).forEach((key) => {
          if (data.stats[key]) {
            formData.append(`stats[${key}]`, data.stats[key]);
          }
        });
      }

      // Add passives
      passives.forEach((passive, index) => {
        formData.append(`passives[${index}][passiveName]`, passive.passiveName);
        formData.append(
          `passives[${index}][passiveDescription]`,
          passive.passiveDescription
        );
      });

      // Add refinements
      refinements.forEach((refinement, index) => {
        formData.append(
          `refinements[${index}][refinementLevel]`,
          refinement.refinementLevel
        );
        formData.append(
          `refinements[${index}][refinementDescription]`,
          refinement.refinementDescription
        );
      });

      // Add icon file if provided
      if (data.icon && data.icon.length > 0) {
        formData.append("icon", data.icon[0]);
      }

      if (isEditMode) {
        // Update weapon
        await weaponService.updateWeapon(id, formData);

        // Update stats if they were provided
        if (data.stats.weaponType) {
          await weaponStatService.addWeaponStats(id, data.stats);
        }

        toast.success("Weapon updated successfully");
      } else {
        // Create weapon
        const result = await weaponService.createWeapon(formData);
        toast.success("Weapon created successfully");
      }

      // Navigate back to weapons list
      navigate("/weapons");
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

  // Handle passive changes
  const handlePassiveChange = (index, field, value) => {
    const newPassives = [...passives];
    newPassives[index][field] = value;
    setPassives(newPassives);
  };

  // Add new passive
  const addPassive = () => {
    setPassives([...passives, { passiveName: "", passiveDescription: "" }]);
  };

  // Remove passive
  const removePassive = (index) => {
    const newPassives = [...passives];
    newPassives.splice(index, 1);
    setPassives(newPassives);
  };

  // Handle refinement changes
  const handleRefinementChange = (index, value) => {
    const newRefinements = [...refinements];
    newRefinements[index].refinementDescription = value;
    setRefinements(newRefinements);
  };

  if (loading) {
    return (
      <Layout title={isEditMode ? "Edit Weapon" : "Add Weapon"}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditMode ? "Edit Weapon" : "Add Weapon"}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Weapon" : "Add New Weapon"}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? "Update weapon information" : "Create a new weapon"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="weapon.name" className="form-label">
                Name
              </label>
              <input
                id="weapon.name"
                type="text"
                className={`form-input ${
                  errors.weapon?.name ? "border-error" : ""
                }`}
                {...register("weapon.name", { required: "Name is required" })}
              />
              {errors.weapon?.name && (
                <p className="form-error">{errors.weapon.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="weapon.rarityId" className="form-label">
                Rarity
              </label>
              <select
                id="weapon.rarityId"
                className={`form-input ${
                  errors.weapon?.rarityId ? "border-error" : ""
                }`}
                {...register("weapon.rarityId", {
                  required: "Rarity is required",
                })}
              >
                <option value="">Select Rarity</option>
                {rarities.map((rarity) => (
                  <option key={rarity.id} value={rarity.id}>
                    {rarity.rarityValue} Star
                  </option>
                ))}
              </select>
              {errors.weapon?.rarityId && (
                <p className="form-error">{errors.weapon.rarityId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="weapon.specialProperty" className="form-label">
                Secondary Stat
              </label>
              <input
                id="weapon.specialProperty"
                type="text"
                className="form-input"
                placeholder="e.g. CRIT Rate, ATK%, Energy Recharge"
                {...register("weapon.specialProperty")}
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="weapon.description" className="form-label">
              Description
            </label>
            <textarea
              id="weapon.description"
              rows="3"
              className="form-input"
              {...register("weapon.description")}
            ></textarea>
          </div>

          <div className="mt-4">
            <label htmlFor="weapon.story" className="form-label">
              Lore
            </label>
            <textarea
              id="weapon.story"
              rows="5"
              className="form-input"
              {...register("weapon.story")}
            ></textarea>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Weapon Stats</h2>
          <p className="text-sm text-gray-600 mb-4">
            Define the base stats of this weapon. The system will automatically
            calculate stats for all levels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="stats.weaponType" className="form-label">
                Weapon Base Stats Type
              </label>
              <select
                id="stats.weaponType"
                className="form-input"
                {...register("stats.weaponType")}
              >
                <option value="">Select Base Stats Type</option>
                {weaponTypes.map((type) => (
                  <option
                    key={type.value || type.id}
                    value={type.value || type.id}
                  >
                    {type.label || type.weaponTypeName} (
                    {type.baseATK || "Unknown"} Base ATK)
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This determines the base ATK scaling of the weapon.
              </p>
            </div>

            <div>
              <label htmlFor="stats.substatType" className="form-label">
                Substat Type
              </label>
              <select
                id="stats.substatType"
                className="form-input"
                {...register("stats.substatType")}
                disabled={!watchWeaponType}
              >
                <option value="">Select Substat Type</option>
                {substatTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="stats.substatValue" className="form-label">
                Base Substat Value
              </label>
              <input
                id="stats.substatValue"
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 4.8"
                {...register("stats.substatValue")}
                disabled={!watchWeaponType || !watchSubstatType}
              />
              <p className="text-xs text-gray-500 mt-1">
                Value at level 1 (e.g. 4.8% for CRIT Rate, 24 for EM).
              </p>
            </div>
          </div>

          {/* Preview Stats Section */}
          {previewStats.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-md mb-2">Stat Preview</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 text-xs text-left">Level</th>
                      <th className="py-2 px-3 text-xs text-left">Ascension</th>
                      <th className="py-2 px-3 text-xs text-left">Base ATK</th>
                      {watchSubstatType && (
                        <th className="py-2 px-3 text-xs text-left">
                          {watchSubstatType
                            .replace(/_/g, " ")
                            .replace(/PERCENT/g, "%")}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {previewStats.map((stat, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-1 px-3 text-xs">{stat.level}</td>
                        <td className="py-1 px-3 text-xs">{stat.ascension}</td>
                        <td className="py-1 px-3 text-xs">{stat.base_atk}</td>
                        {watchSubstatType && (
                          <td className="py-1 px-3 text-xs">
                            {stat.sub_stat_value}
                            {watchSubstatType.includes("PERCENT") ? "%" : ""}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Passive Ability</h2>

          {passives.map((passive, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded relative">
              <div className="absolute top-2 right-2">
                {passives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassive(index)}
                    className="text-error hover:text-red-700"
                  >
                    <FiTrash size={16} />
                  </button>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Passive Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={passive.passiveName}
                  onChange={(e) =>
                    handlePassiveChange(index, "passiveName", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  className="form-input"
                  value={passive.passiveDescription}
                  onChange={(e) =>
                    handlePassiveChange(
                      index,
                      "passiveDescription",
                      e.target.value
                    )
                  }
                ></textarea>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addPassive}
            className="btn btn-outline flex items-center mt-2"
          >
            <FiPlus className="mr-2" />
            Add Passive Ability
          </button>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            Refinement Descriptions
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Define how the weapon's passive changes at each refinement level.
          </p>

          {refinements.map((refinement, index) => (
            <div key={index} className="mb-4">
              <label className="form-label">
                Refinement {refinement.refinementLevel}
              </label>
              <textarea
                rows="2"
                className="form-input"
                value={refinement.refinementDescription}
                onChange={(e) => handleRefinementChange(index, e.target.value)}
              ></textarea>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Weapon Image</h2>

          <div className="flex items-center">
            <div className="flex-shrink-0">
              {iconPreview ? (
                <img
                  src={iconPreview}
                  alt="Weapon icon preview"
                  className="w-24 h-24 object-contain rounded"
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
                onChange={handleFileChange}
              />
              <label
                htmlFor="icon"
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
            onClick={() => navigate("/weapons")}
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
              ? "Update Weapon"
              : "Save Weapon"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default WeaponForm;
