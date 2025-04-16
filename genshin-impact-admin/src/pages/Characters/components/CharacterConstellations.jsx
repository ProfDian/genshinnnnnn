import React, { useState, useEffect } from "react";
import { characterSkillsService } from "../../../services";
import { FiUpload } from "react-icons/fi";

const CharacterConstellations = ({ characterId }) => {
  const [constellations, setConstellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    constellationLevel: "",
    constellationName: "",
    constellationDescription: "",
    constellationIcon: null,
  });
  const [iconPreview, setIconPreview] = useState(null);

  useEffect(() => {
    const fetchConstellations = async () => {
      try {
        setLoading(true);
        const data = await characterSkillsService.getCharacterConstellations(
          characterId
        );
        setConstellations(data);
      } catch (error) {
        console.error("Error fetching character constellations:", error);
        setError("Failed to load character constellations.");
      } finally {
        setLoading(false);
      }
    };

    fetchConstellations();
  }, [characterId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        constellationIcon: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert constellation level to integer
      const constellationData = new FormData();
      constellationData.append(
        "constellationLevel",
        parseInt(formData.constellationLevel)
      );
      constellationData.append("constellationName", formData.constellationName);

      if (formData.constellationDescription) {
        constellationData.append(
          "constellationDescription",
          formData.constellationDescription
        );
      }

      if (formData.constellationIcon) {
        constellationData.append(
          "constellationIcon",
          formData.constellationIcon
        );
      }

      // Add new constellation
      await characterSkillsService.addCharacterConstellation(
        characterId,
        constellationData
      );

      // Refresh constellations list
      const updatedConstellations =
        await characterSkillsService.getCharacterConstellations(characterId);
      setConstellations(updatedConstellations);

      // Reset form
      setFormData({
        constellationLevel: "",
        constellationName: "",
        constellationDescription: "",
        constellationIcon: null,
      });
      setIconPreview(null);

      setShowForm(false);
    } catch (error) {
      console.error("Error adding constellation:", error);
      setError("Failed to add constellation. Please try again.");
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
        <h2 className="text-xl font-semibold">Character Constellations</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Constellation"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-4">Add New Constellation</h3>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Constellation Level
                </label>
                <select
                  name="constellationLevel"
                  value={formData.constellationLevel}
                  onChange={handleInputChange}
                  required
                  className="form-input w-full"
                >
                  <option value="">Select Level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Constellation Name
                </label>
                <input
                  type="text"
                  name="constellationName"
                  value={formData.constellationName}
                  onChange={handleInputChange}
                  required
                  className="form-input w-full"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="constellationDescription"
                value={formData.constellationDescription}
                onChange={handleInputChange}
                rows="4"
                className="form-input w-full"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Constellation Icon
              </label>
              <div className="flex items-center">
                <div className="mr-4">
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Constellation preview"
                      className="w-16 h-16 object-contain rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <FiUpload className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="constellationIcon"
                    name="constellationIcon"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="constellationIcon"
                    className="btn btn-outline flex items-center cursor-pointer"
                  >
                    <FiUpload className="mr-2" />
                    {formData.constellationIcon ? "Change Icon" : "Choose Icon"}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Save Constellation
              </button>
            </div>
          </form>
        </div>
      )}

      {constellations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No constellations data available for this character.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sort constellations by level */}
          {[...constellations]
            .sort((a, b) => a.constellationLevel - b.constellationLevel)
            .map((constellation) => (
              <div key={constellation.id} className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-start">
                  {constellation.constellationIcon && (
                    <img
                      src={constellation.constellationIcon}
                      alt={`Constellation ${constellation.constellationLevel}`}
                      className="w-16 h-16 mr-4 object-contain rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-primary flex items-center">
                      <span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-xs">
                        {constellation.constellationLevel}
                      </span>
                      {constellation.constellationName}
                    </h3>
                    <p className="mt-2 whitespace-pre-line">
                      {constellation.constellationDescription}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CharacterConstellations;
