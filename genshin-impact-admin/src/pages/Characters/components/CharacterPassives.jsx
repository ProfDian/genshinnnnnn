import React, { useState, useEffect } from "react";
import { characterSkillsService } from "../../../services";

const CharacterPassives = ({ characterId }) => {
  const [passives, setPassives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    passiveOrder: "",
    passiveName: "",
    passiveDescription: "",
    unlockLevel: "",
  });

  useEffect(() => {
    const fetchPassives = async () => {
      try {
        setLoading(true);
        const data = await characterSkillsService.getCharacterPassives(
          characterId
        );
        setPassives(data);
      } catch (error) {
        console.error("Error fetching character passives:", error);
        setError("Failed to load character passives.");
      } finally {
        setLoading(false);
      }
    };

    fetchPassives();
  }, [characterId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert numeric fields
      const passiveData = {
        ...formData,
        passiveOrder: parseInt(formData.passiveOrder),
        unlockLevel: formData.unlockLevel
          ? parseInt(formData.unlockLevel)
          : null,
      };

      // Add new passive
      await characterSkillsService.addCharacterPassive(
        characterId,
        passiveData
      );

      // Refresh passives list
      const updatedPassives = await characterSkillsService.getCharacterPassives(
        characterId
      );
      setPassives(updatedPassives);

      // Reset form
      setFormData({
        passiveOrder: "",
        passiveName: "",
        passiveDescription: "",
        unlockLevel: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error adding passive:", error);
      setError("Failed to add passive. Please try again.");
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Character Passives</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Passive"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-4">Add New Passive</h3>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Passive Order
                </label>
                <input
                  type="number"
                  name="passiveOrder"
                  value={formData.passiveOrder}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="3"
                  className="form-input w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Order in which passive appears (1-3)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Unlock Level
                </label>
                <input
                  type="number"
                  name="unlockLevel"
                  value={formData.unlockLevel}
                  onChange={handleInputChange}
                  className="form-input w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Character level required to unlock this passive
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Passive Name
              </label>
              <input
                type="text"
                name="passiveName"
                value={formData.passiveName}
                onChange={handleInputChange}
                required
                className="form-input w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="passiveDescription"
                value={formData.passiveDescription}
                onChange={handleInputChange}
                rows="4"
                className="form-input w-full"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Save Passive
              </button>
            </div>
          </form>
        </div>
      )}

      {passives.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No passives data available for this character.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Sort passives by order */}
          {[...passives]
            .sort((a, b) => a.passiveOrder - b.passiveOrder)
            .map((passive) => (
              <div key={passive.id} className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between">
                  <h3 className="font-medium text-primary">
                    {passive.passiveName}
                  </h3>
                  {passive.unlockLevel && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Unlocks at Ascension {passive.unlockLevel}
                    </span>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-line">
                  {passive.passiveDescription}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CharacterPassives;
