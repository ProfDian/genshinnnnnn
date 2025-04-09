// src/pages/CharacterStats.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { characterAPI, characterStatsAPI } from "../services/api";
import Swal from "sweetalert2";
import { FaArrowLeft, FaSave, FaSpinner } from "react-icons/fa";

export default function CharacterStats() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [character, setCharacter] = useState(null);
  const [stats, setStats] = useState([]);
  const [statTypes, setStatTypes] = useState([]);
  const [levelMap, setLevelMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form data
  const [selectedStatType, setSelectedStatType] = useState("");
  const [baseStats, setBaseStats] = useState({});

  useEffect(() => {
    fetchCharacterAndStats();
  }, [id]);

  async function fetchCharacterAndStats() {
    try {
      setLoading(true);

      // Fetch karakter
      const characterData = await characterAPI.getCharacterById(id);
      setCharacter(characterData);

      // Fetch jenis stat
      const statTypesData = await characterStatsAPI.getStatTypes();
      setStatTypes(statTypesData);

      // Fetch level map
      const levelMapData = await characterStatsAPI.getLevelAscensionMap();
      setLevelMap(levelMapData);

      // Initialize base stats dengan nilai default
      const initialBaseStats = {};
      levelMapData.forEach((item) => {
        initialBaseStats[item.level] = "";
      });
      setBaseStats(initialBaseStats);

      // Fetch stats karakter jika ada
      try {
        const statsData = await characterStatsAPI.getCharacterStats(id);
        setStats(statsData);

        if (statsData.length > 0) {
          // Set nilai statType
          setSelectedStatType(statsData[0].statType);

          // Set nilai baseStats dari data yang ada
          const statsByLevel = {};
          statsData.forEach((stat) => {
            statsByLevel[stat.level] = stat.baseAtk;
          });
          setBaseStats(statsByLevel);
        }
      } catch (error) {
        console.log("Karakter belum memiliki stat, siap untuk dibuat");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load character data",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleBaseStatChange = (level, value) => {
    setBaseStats((prev) => ({
      ...prev,
      [level]: value,
    }));
  };

  const handlePreview = async () => {
    try {
      // Validasi input
      const missingValues = Object.entries(baseStats).filter(
        ([_, value]) => !value
      );
      if (missingValues.length > 0 || !selectedStatType) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Data",
          text: "Please fill in all base ATK values and select a stat type",
        });
        return;
      }

      // Format data untuk preview
      const baseStatsArray = Object.entries(baseStats).map(
        ([level, baseAtk]) => ({
          level: parseInt(level),
          baseAtk: parseFloat(baseAtk),
        })
      );

      const previewData = await characterStatsAPI.previewCharacterStats({
        statType: selectedStatType,
        rarityValue: character.rarity.rarityValue,
        baseStats: baseStatsArray,
      });

      // Tampilkan preview dalam dialog
      let previewHtml = `
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th class="border px-4 py-2">Level</th>
              <th class="border px-4 py-2">Ascension</th>
              <th class="border px-4 py-2">Base ATK</th>
              <th class="border px-4 py-2">${selectedStatType.replace(
                /_/g,
                " "
              )}</th>
            </tr>
          </thead>
          <tbody>
      `;

      previewData.forEach((stat) => {
        previewHtml += `
          <tr>
            <td class="border px-4 py-2">${stat.level}</td>
            <td class="border px-4 py-2">${stat.ascension}</td>
            <td class="border px-4 py-2">${stat.baseAtk}</td>
            <td class="border px-4 py-2">${stat.statValue}</td>
          </tr>
        `;
      });

      previewHtml += `
          </tbody>
        </table>
      </div>
      `;

      Swal.fire({
        title: "Stat Preview",
        html: previewHtml,
        width: 800,
        confirmButtonText: "Close",
      });
    } catch (error) {
      console.error("Error generating preview:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to generate preview",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validasi input
      const missingValues = Object.entries(baseStats).filter(
        ([_, value]) => !value
      );
      if (missingValues.length > 0 || !selectedStatType) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Data",
          text: "Please fill in all base ATK values and select a stat type",
        });
        return;
      }

      setSaving(true);

      // Format data untuk submit
      const baseStatsArray = Object.entries(baseStats).map(
        ([level, baseAtk]) => ({
          level: parseInt(level),
          baseAtk: parseFloat(baseAtk),
        })
      );

      await characterStatsAPI.addCharacterStats(id, {
        statType: selectedStatType,
        baseStats: baseStatsArray,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Character stats have been updated",
      });

      // Refresh stats data
      fetchCharacterAndStats();
    } catch (error) {
      console.error("Error saving stats:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save character stats",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FaSpinner className="animate-spin inline-block h-8 w-8 text-primary mb-2" />
          <p>Loading character data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Character Stats</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          {character && (
            <div className="mb-6 flex items-center">
              {character.icon && (
                <img
                  src={character.icon}
                  alt={character.name}
                  className="h-16 w-16 rounded-full object-cover mr-4"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {character.name}
                </h2>
                <p className="text-gray-600">{character.title}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500 mr-4">
                    Rarity: {character.rarity?.rarityValue || "N/A"}
                  </span>
                  <span className="text-sm text-gray-500">
                    Element: {character.element?.elementName || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="form-label">Stat Type</label>
              <select
                value={selectedStatType}
                onChange={(e) => setSelectedStatType(e.target.value)}
                className="form-input"
                disabled={saving}
              >
                <option value="">Select Stat Type</option>
                {statTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                This is the secondary stat that increases with ascension.
              </p>
            </div>

            <div className="mb-6">
              <label className="form-label">Base ATK per Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {levelMap.map((item) => (
                  <div key={item.level} className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                      Level {item.level} (Ascension {item.ascension})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={baseStats[item.level] || ""}
                      onChange={(e) =>
                        handleBaseStatChange(item.level, e.target.value)
                      }
                      className="form-input"
                      placeholder="Base ATK"
                      disabled={saving}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePreview}
                className="btn btn-secondary"
                disabled={saving}
              >
                Preview Stats
              </button>

              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Stats
                  </>
                )}
              </button>
            </div>
          </form>

          {stats.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Current Stats
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ascension
                      </th>
                      <th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Base ATK
                      </th>
                      <th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {stats[0].statType.replace(/_/g, " ")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.map((stat) => (
                      <tr key={stat.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{stat.level}</td>
                        <td className="border px-4 py-2">{stat.ascension}</td>
                        <td className="border px-4 py-2">{stat.baseAtk}</td>
                        <td className="border px-4 py-2">{stat.statValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
