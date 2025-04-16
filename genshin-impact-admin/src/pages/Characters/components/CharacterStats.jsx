import React, { useState, useEffect } from "react";
import { characterStatService, characterService } from "../../../services";
import { FiEdit } from "react-icons/fi";

const CharacterStats = ({ characterId }) => {
  const [stats, setStats] = useState([]);
  const [statTypes, setStatTypes] = useState([]);
  const [levelMap, setLevelMap] = useState([]);
  const [baseStatValues, setBaseStatValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state for adding/editing stats
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    statType: "",
    baseStats: {
      hp: "",
      atk: "",
      def: "",
    },
    maxAscensionValues: {
      hp: "",
      atk: "",
      def: "",
    },
  });

  // For stat preview before saving
  const [previewStats, setPreviewStats] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch character stats
        const characterStatsData = await characterStatService.getCharacterStats(
          characterId
        );
        setStats(characterStatsData);

        // Fetch stat types for dropdown
        const statTypesData = await characterStatService.getStatTypes();
        setStatTypes(statTypesData);

        // Fetch level ascension map
        const levelMapData = await characterStatService.getLevelAscensionMap();
        setLevelMap(levelMapData);

        // Fetch base stat values
        const baseStatValuesData =
          await characterStatService.getBaseStatValues();
        setBaseStatValues(baseStatValuesData);
      } catch (error) {
        console.error("Error fetching stats data:", error);
        setError("Failed to load character stats data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [characterId]);

  // Fungsi untuk mengatur form dengan nilai stat yang sudah ada
  const handleEditStats = async () => {
    try {
      if (stats.length === 0) return;

      const firstStat = stats[0];
      const statType = firstStat.statType;

      // Cari stats untuk level 1 (base) dan level 90 ascension 6 (max)
      const baseStats = stats.find(
        (stat) => stat.level === 1 && stat.ascension === 0
      );

      const maxStats = stats.find(
        (stat) => stat.level === 90 && stat.ascension === 6
      );

      if (baseStats && maxStats) {
        // Set form data dengan nilai yang sudah ada
        setFormData({
          statType: statType,
          baseStats: {
            hp: baseStats.hp,
            atk: baseStats.baseAtk,
            def: baseStats.def,
          },
          maxAscensionValues: {
            hp: maxStats.hp,
            atk: maxStats.baseAtk,
            def: maxStats.def,
          },
        });

        setIsEditMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Error setting edit form:", error);
      setError("Failed to initialize edit form.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePreviewStats = async () => {
    try {
      // Get character data to get rarity
      const character = await characterService.getCharacterById(characterId);

      if (!character || !character.rarity) {
        setError("Character rarity is required for stat calculation");
        return;
      }

      const previewData = {
        statType: formData.statType,
        rarityValue: character.rarity.rarityValue,
        baseStats: {
          hp: parseFloat(formData.baseStats.hp),
          atk: parseFloat(formData.baseStats.atk),
          def: parseFloat(formData.baseStats.def),
        },
        maxAscensionValues: {
          hp: parseFloat(formData.maxAscensionValues.hp),
          atk: parseFloat(formData.maxAscensionValues.atk),
          def: parseFloat(formData.maxAscensionValues.def),
        },
      };

      const response = await characterStatService.previewCharacterStats(
        previewData
      );
      setPreviewStats(response);
      setShowPreview(true);
    } catch (error) {
      console.error("Error previewing stats:", error);
      setError(
        "Failed to preview character stats. Please check your input values."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const statsData = {
        statType: formData.statType,
        baseStats: {
          hp: parseFloat(formData.baseStats.hp),
          atk: parseFloat(formData.baseStats.atk),
          def: parseFloat(formData.baseStats.def),
        },
        maxAscensionValues: {
          hp: parseFloat(formData.maxAscensionValues.hp),
          atk: parseFloat(formData.maxAscensionValues.atk),
          def: parseFloat(formData.maxAscensionValues.def),
        },
      };

      await characterStatService.addCharacterStats(characterId, statsData);

      // Refresh character stats
      const updatedStats = await characterStatService.getCharacterStats(
        characterId
      );
      setStats(updatedStats);

      // Reset form
      setShowForm(false);
      setShowPreview(false);
      setIsEditMode(false);
      setFormData({
        statType: "",
        baseStats: {
          hp: "",
          atk: "",
          def: "",
        },
        maxAscensionValues: {
          hp: "",
          atk: "",
          def: "",
        },
      });
    } catch (error) {
      console.error("Error saving character stats:", error);
      setError("Failed to save character stats. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
    );
  }

  const getStatValueDisplay = (stat) => {
    // Format stat value based on type
    if (
      stat.statType.includes("PERCENT") ||
      stat.statType === "CRIT_RATE" ||
      stat.statType === "CRIT_DMG" ||
      stat.statType === "ENERGY_RECHARGE" ||
      stat.statType.includes("DMG")
    ) {
      // Cek apakah ada displayStatValue (yang sudah termasuk nilai base)
      if (stat.displayStatValue !== undefined) {
        return `${stat.displayStatValue}%`;
      }

      // Gunakan baseStatValues dari service
      let value = stat.statValue;
      if (stat.statType === "CRIT_RATE" && baseStatValues.CRIT_RATE) {
        value += baseStatValues.CRIT_RATE;
      } else if (stat.statType === "CRIT_DMG" && baseStatValues.CRIT_DMG) {
        value += baseStatValues.CRIT_DMG;
      } else if (
        stat.statType === "ENERGY_RECHARGE" &&
        baseStatValues.ENERGY_RECHARGE
      ) {
        value += baseStatValues.ENERGY_RECHARGE;
      }

      return `${value}%`;
    }
    return stat.statValue;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Character Stats</h2>

        {!showForm && (
          <div>
            {stats.length === 0 ? (
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Add Character Stats
              </button>
            ) : (
              <button
                className="btn btn-secondary flex items-center"
                onClick={handleEditStats}
              >
                <FiEdit className="mr-2" />
                Edit Character Stats
              </button>
            )}
          </div>
        )}
      </div>

      {showForm ? (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-4">
            {isEditMode ? "Edit Character Stats" : "Add Character Stats"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Stat Type
              </label>
              <select
                name="statType"
                value={formData.statType}
                onChange={handleInputChange}
                required
                className="form-input w-full"
                disabled={isEditMode} // Disable changing stat type in edit mode
              >
                <option value="">Select Stat Type</option>
                {statTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This is the stat type that increases with ascension (e.g.
                CRIT_RATE, ELEMENTAL_MASTERY)
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Base Stats (Level 1)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">HP</label>
                  <input
                    type="number"
                    name="baseStats.hp"
                    value={formData.baseStats.hp}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ATK</label>
                  <input
                    type="number"
                    name="baseStats.atk"
                    value={formData.baseStats.atk}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">DEF</label>
                  <input
                    type="number"
                    name="baseStats.def"
                    value={formData.baseStats.def}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    className="form-input w-full"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">
                Max Ascension Values (Level 90)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">HP</label>
                  <input
                    type="number"
                    name="maxAscensionValues.hp"
                    value={formData.maxAscensionValues.hp}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ATK</label>
                  <input
                    type="number"
                    name="maxAscensionValues.atk"
                    value={formData.maxAscensionValues.atk}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">DEF</label>
                  <input
                    type="number"
                    name="maxAscensionValues.def"
                    value={formData.maxAscensionValues.def}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    className="form-input w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setShowForm(false);
                  setShowPreview(false);
                  setIsEditMode(false);
                  setFormData({
                    statType: "",
                    baseStats: {
                      hp: "",
                      atk: "",
                      def: "",
                    },
                    maxAscensionValues: {
                      hp: "",
                      atk: "",
                      def: "",
                    },
                  });
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePreviewStats}
              >
                Preview Stats
              </button>

              <button type="submit" className="btn btn-primary">
                {isEditMode ? "Update Stats" : "Save Stats"}
              </button>
            </div>
          </form>

          {showPreview && previewStats.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Stats Preview</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Level</th>
                      <th className="px-4 py-2 text-left">Ascension</th>
                      <th className="px-4 py-2 text-right">HP</th>
                      <th className="px-4 py-2 text-right">ATK</th>
                      <th className="px-4 py-2 text-right">DEF</th>
                      <th className="px-4 py-2 text-right">
                        {formData.statType.replace(/_/g, " ")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewStats.map((stat, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-2">{stat.level}</td>
                        <td className="px-4 py-2">{stat.ascension}</td>
                        <td className="px-4 py-2 text-right">
                          {stat.hp.toFixed(1)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {stat.baseAtk.toFixed(1)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {stat.def.toFixed(1)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {getStatValueDisplay(stat)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {stats.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Level</th>
                <th className="px-4 py-2 text-left">Ascension</th>
                <th className="px-4 py-2 text-right">HP</th>
                <th className="px-4 py-2 text-right">ATK</th>
                <th className="px-4 py-2 text-right">DEF</th>
                <th className="px-4 py-2 text-right">
                  {stats[0].statType.replace(/_/g, " ")}
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat, index) => (
                <tr
                  key={stat.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2">{stat.level}</td>
                  <td className="px-4 py-2">{stat.ascension}</td>
                  <td className="px-4 py-2 text-right">{stat.hp.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right">
                    {stat.baseAtk.toFixed(1)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {stat.def.toFixed(1)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {getStatValueDisplay(stat)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No stats data available for this character.
          </p>
          {!showForm && (
            <button
              className="btn btn-primary mt-4"
              onClick={() => setShowForm(true)}
            >
              Add Character Stats
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterStats;
