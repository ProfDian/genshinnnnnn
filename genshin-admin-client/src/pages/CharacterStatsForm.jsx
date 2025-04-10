// src/pages/CharacterStatsForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { characterAPI, characterStatsAPI } from "../services/api";
import { FaArrowLeft, FaSave, FaSpinner, FaEye } from "react-icons/fa";

export default function CharacterStatsForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [character, setCharacter] = useState(null);
  const [statTypes, setStatTypes] = useState([]);
  const [baseStatValues, setBaseStatValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form data
  const [selectedStatType, setSelectedStatType] = useState("");
  const [baseStats, setBaseStats] = useState({
    hp: "",
    atk: "",
    def: "",
  });
  const [maxAscensionValues, setMaxAscensionValues] = useState({
    hp: "",
    atk: "",
    def: "",
  });

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

      // Fetch nilai dasar stats
      try {
        const baseValuesData = await characterStatsAPI.getBaseStatValues();
        setBaseStatValues(baseValuesData);
      } catch (error) {
        console.error("Failed to load base stat values", error);
      }

      // Cek apakah karakter sudah memiliki stats
      try {
        const statsData = await characterStatsAPI.getCharacterStats(id);
        if (statsData.length > 0) {
          // Set nilai statType
          setSelectedStatType(statsData[0].statType);

          // Karena kita tidak memiliki data level 1 langsung, kita hanya kasih notifikasi
          setSuccess(
            "Karakter ini sudah memiliki stats. Jika Anda mengubah stats, data yang lama akan dihapus."
          );
        }
      } catch (error) {
        console.log("Karakter belum memiliki stat, siap untuk dibuat");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal memuat data karakter");
    } finally {
      setLoading(false);
    }
  }

  const handleBaseStatChange = (field, value) => {
    setBaseStats((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMaxAscensionChange = (field, value) => {
    setMaxAscensionValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreview = async () => {
    try {
      // Validasi input
      if (
        !selectedStatType ||
        !baseStats.hp ||
        !baseStats.atk ||
        !baseStats.def ||
        !maxAscensionValues.hp ||
        !maxAscensionValues.atk ||
        !maxAscensionValues.def
      ) {
        setError(
          "Silakan lengkapi semua data stats level 1, nilai max ascension, dan pilih jenis stat bonus"
        );
        return;
      }

      // Format data untuk preview
      const previewData = await characterStatsAPI.previewCharacterStats({
        statType: selectedStatType,
        rarityValue: character.rarity.rarityValue,
        baseStats: {
          hp: parseFloat(baseStats.hp),
          atk: parseFloat(baseStats.atk),
          def: parseFloat(baseStats.def),
        },
        maxAscensionValues: {
          hp: parseFloat(maxAscensionValues.hp),
          atk: parseFloat(maxAscensionValues.atk),
          def: parseFloat(maxAscensionValues.def),
        },
      });

      // Tampilkan preview dalam dialog
      let previewHtml = `
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th class="border px-4 py-2">Level</th>
              <th class="border px-4 py-2">Ascension</th>
              <th class="border px-4 py-2">HP</th>
              <th class="border px-4 py-2">ATK</th>
              <th class="border px-4 py-2">DEF</th>
              <th class="border px-4 py-2">${selectedStatType.replace(
                /_/g,
                " "
              )}</th>
            </tr>
          </thead>
          <tbody>
      `;

      previewData.forEach((stat) => {
        // Gunakan displayStatValue jika ada (sudah termasuk nilai dasar)
        const statValueDisplay =
          stat.displayStatValue !== undefined
            ? stat.displayStatValue
            : stat.statValue;

        previewHtml += `
          <tr>
            <td class="border px-4 py-2">${stat.level}</td>
            <td class="border px-4 py-2">${stat.ascension}</td>
            <td class="border px-4 py-2">${stat.hp.toFixed(1)}</td>
            <td class="border px-4 py-2">${stat.baseAtk.toFixed(1)}</td>
            <td class="border px-4 py-2">${stat.def.toFixed(1)}</td>
            <td class="border px-4 py-2">${statValueDisplay.toFixed(
              1
            )}${getStatSuffix(selectedStatType)}</td>
          </tr>
        `;
      });

      previewHtml += `
          </tbody>
        </table>
      </div>
      `;

      // Tampilkan dialog - gunakan library notifikasi yang sudah ada
      // Contoh dengan alert native (bisa diganti dengan SweetAlert jika diinginkan)
      const previewWindow = window.open("", "_blank", "width=800,height=600");
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview Stats ${character.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <h2>Preview Stats for ${character.name}</h2>
            ${previewHtml}
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error generating preview:", error);
      setError("Gagal membuat preview stats");
    }
  };

  // Helper untuk menambahkan suffix pada nilai stat
  const getStatSuffix = (statType) => {
    if (
      statType.includes("PERCENT") ||
      statType.includes("DMG") ||
      statType === "CRIT_RATE" ||
      statType === "CRIT_DMG" ||
      statType === "ENERGY_RECHARGE" ||
      statType === "HEALING_BONUS"
    ) {
      return "%";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validasi input
      if (
        !selectedStatType ||
        !baseStats.hp ||
        !baseStats.atk ||
        !baseStats.def ||
        !maxAscensionValues.hp ||
        !maxAscensionValues.atk ||
        !maxAscensionValues.def
      ) {
        setError(
          "Silakan lengkapi semua data stats level 1, nilai max ascension, dan pilih jenis stat bonus"
        );
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(null);

      // Format data untuk submit
      await characterStatsAPI.addCharacterStats(id, {
        statType: selectedStatType,
        baseStats: {
          hp: parseFloat(baseStats.hp),
          atk: parseFloat(baseStats.atk),
          def: parseFloat(baseStats.def),
        },
        maxAscensionValues: {
          hp: parseFloat(maxAscensionValues.hp),
          atk: parseFloat(maxAscensionValues.atk),
          def: parseFloat(maxAscensionValues.def),
        },
      });

      setSuccess("Stats karakter berhasil disimpan");

      // Refresh stats data
      fetchCharacterAndStats();
    } catch (error) {
      console.error("Error saving stats:", error);
      setError(
        error.response?.data?.message || "Gagal menyimpan stats karakter"
      );
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
          <h1 className="text-2xl font-bold text-gray-800">
            Character Stats Generator
          </h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
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

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Informasi Bonus Stat
              </h3>
              <p className="mb-4 text-gray-600">
                Bonus stat adalah stat tambahan yang meningkat saat karakter
                di-ascend. Setiap karakter memiliki satu jenis bonus stat.
              </p>
              <div className="mb-4">
                <label className="form-label">Jenis Bonus Stat</label>
                <select
                  value={selectedStatType}
                  onChange={(e) => setSelectedStatType(e.target.value)}
                  className="form-input"
                  disabled={saving}
                >
                  <option value="">Pilih Jenis Bonus Stat</option>
                  {statTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {selectedStatType &&
                  (selectedStatType === "CRIT_RATE" ||
                    selectedStatType === "CRIT_DMG" ||
                    selectedStatType === "ENERGY_RECHARGE") && (
                    <div className="mt-2 text-sm text-blue-600">
                      <p>
                        Catatan: Nilai dasar{" "}
                        {
                          statTypes.find((t) => t.value === selectedStatType)
                            ?.label
                        }{" "}
                        adalah
                        {selectedStatType === "CRIT_RATE" && " 5%"}
                        {selectedStatType === "CRIT_DMG" && " 50%"}
                        {selectedStatType === "ENERGY_RECHARGE" && " 100%"}.
                        Nilai ini akan otomatis ditambahkan ke hasil
                        perhitungan.
                      </p>
                    </div>
                  )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Stats Dasar Level 1
              </h3>
              <p className="mb-4 text-gray-600">
                Masukkan nilai stats dasar karakter pada level 1. Sistem akan
                otomatis menghitung stats untuk semua level dan ascension phase.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">HP Level 1</label>
                  <input
                    type="number"
                    step="0.01"
                    value={baseStats.hp}
                    onChange={(e) => handleBaseStatChange("hp", e.target.value)}
                    className="form-input"
                    placeholder="Contoh: 1039.12"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="form-label">ATK Level 1</label>
                  <input
                    type="number"
                    step="0.01"
                    value={baseStats.atk}
                    onChange={(e) =>
                      handleBaseStatChange("atk", e.target.value)
                    }
                    className="form-input"
                    placeholder="Contoh: 24.39"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="form-label">DEF Level 1</label>
                  <input
                    type="number"
                    step="0.01"
                    value={baseStats.def}
                    onChange={(e) =>
                      handleBaseStatChange("def", e.target.value)
                    }
                    className="form-input"
                    placeholder="Contoh: 60.85"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Max Ascension Values (Level 90)
              </h3>
              <p className="mb-4 text-gray-600">
                Masukkan nilai max ascension untuk karakter ini pada level 90.
                Nilai ini digunakan untuk menghitung peningkatan stats saat
                ascension.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Max HP Ascension</label>
                  <input
                    type="number"
                    step="0.01"
                    value={maxAscensionValues.hp}
                    onChange={(e) =>
                      handleMaxAscensionChange("hp", e.target.value)
                    }
                    className="form-input"
                    placeholder="Contoh: 4267.18"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="form-label">Max ATK Ascension</label>
                  <input
                    type="number"
                    step="0.01"
                    value={maxAscensionValues.atk}
                    onChange={(e) =>
                      handleMaxAscensionChange("atk", e.target.value)
                    }
                    className="form-input"
                    placeholder="Contoh: 100.16"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="form-label">Max DEF Ascension</label>
                  <input
                    type="number"
                    step="0.01"
                    value={maxAscensionValues.def}
                    onChange={(e) =>
                      handleMaxAscensionChange("def", e.target.value)
                    }
                    className="form-input"
                    placeholder="Contoh: 249.88"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePreview}
                className="btn btn-secondary flex items-center gap-2"
                disabled={saving}
              >
                <FaEye /> Preview Stats
              </button>

              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <FaSave /> Generate Stats
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
