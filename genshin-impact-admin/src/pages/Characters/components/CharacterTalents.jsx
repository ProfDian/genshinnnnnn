import React, { useState, useEffect } from "react";
import { characterSkillsService } from "../../../services";

const CharacterTalents = ({ characterId }) => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    talentType: "",
    talentName: "",
    talentDescription: "",
  });

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true);
        const data = await characterSkillsService.getCharacterTalents(
          characterId
        );
        setTalents(data);
      } catch (error) {
        console.error("Error fetching character talents:", error);
        setError("Failed to load character talents.");
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
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
      // Add new talent
      await characterSkillsService.addCharacterTalent(characterId, formData);

      // Refresh talents list
      const updatedTalents = await characterSkillsService.getCharacterTalents(
        characterId
      );
      setTalents(updatedTalents);

      // Reset form
      setFormData({
        talentType: "",
        talentName: "",
        talentDescription: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error adding talent:", error);
      setError("Failed to add talent. Please try again.");
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

  // Group talents by type
  const normalAttacks = talents.filter(
    (talent) => talent.talentType === "NORMAL_ATTACK"
  );
  const elementalSkills = talents.filter(
    (talent) => talent.talentType === "ELEMENTAL_SKILL"
  );
  const elementalBursts = talents.filter(
    (talent) => talent.talentType === "ELEMENTAL_BURST"
  );
  const otherTalents = talents.filter(
    (talent) =>
      !["NORMAL_ATTACK", "ELEMENTAL_SKILL", "ELEMENTAL_BURST"].includes(
        talent.talentType
      )
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Character Talents</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Talent"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-4">Add New Talent</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Talent Type
              </label>
              <select
                name="talentType"
                value={formData.talentType}
                onChange={handleInputChange}
                required
                className="form-input w-full"
              >
                <option value="">Select Talent Type</option>
                <option value="NORMAL_ATTACK">Normal Attack</option>
                <option value="ELEMENTAL_SKILL">Elemental Skill</option>
                <option value="ELEMENTAL_BURST">Elemental Burst</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Talent Name
              </label>
              <input
                type="text"
                name="talentName"
                value={formData.talentName}
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
                name="talentDescription"
                value={formData.talentDescription}
                onChange={handleInputChange}
                rows="4"
                className="form-input w-full"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Save Talent
              </button>
            </div>
          </form>
        </div>
      )}

      {talents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No talents data available for this character.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Normal Attacks */}
          {normalAttacks.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Normal Attack</h3>
              {normalAttacks.map((talent) => (
                <div key={talent.id} className="bg-gray-50 p-4 rounded-md mb-3">
                  <h4 className="font-medium text-primary">
                    {talent.talentName}
                  </h4>
                  <p className="mt-2 whitespace-pre-line">
                    {talent.talentDescription}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Elemental Skills */}
          {elementalSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Elemental Skill</h3>
              {elementalSkills.map((talent) => (
                <div key={talent.id} className="bg-gray-50 p-4 rounded-md mb-3">
                  <h4 className="font-medium text-primary">
                    {talent.talentName}
                  </h4>
                  <p className="mt-2 whitespace-pre-line">
                    {talent.talentDescription}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Elemental Bursts */}
          {elementalBursts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Elemental Burst</h3>
              {elementalBursts.map((talent) => (
                <div key={talent.id} className="bg-gray-50 p-4 rounded-md mb-3">
                  <h4 className="font-medium text-primary">
                    {talent.talentName}
                  </h4>
                  <p className="mt-2 whitespace-pre-line">
                    {talent.talentDescription}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Other Talents */}
          {otherTalents.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Other Talents</h3>
              {otherTalents.map((talent) => (
                <div key={talent.id} className="bg-gray-50 p-4 rounded-md mb-3">
                  <h4 className="font-medium text-primary">
                    {talent.talentName}
                  </h4>
                  <p className="mt-2 whitespace-pre-line">
                    {talent.talentDescription}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterTalents;
