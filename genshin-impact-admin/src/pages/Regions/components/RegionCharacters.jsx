import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiEdit, FiEye } from "react-icons/fi";
import regionService from "../../../services/regionService";

const RegionCharacters = ({ regionId }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const data = await regionService.getCharactersByRegion(regionId);
        setCharacters(data);
      } catch (error) {
        console.error("Error fetching characters:", error);
        toast.error("Failed to load characters for this region");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [regionId]);

  // Helper function to get element color
  const getElementColor = (elementName) => {
    const colors = {
      Pyro: "#f44336",
      Hydro: "#2196f3",
      Anemo: "#4caf50",
      Electro: "#9c27b0",
      Dendro: "#8bc34a",
      Cryo: "#00bcd4",
      Geo: "#ff9800",
    };

    return colors[elementName] || "#888888";
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Region Characters</h2>
      <p className="text-sm text-gray-600 mb-4">
        Characters associated with this region.
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : characters.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-md">
          <p className="text-gray-500">No characters found for this region.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <div
              key={character.id}
              className="border rounded-md overflow-hidden hover:shadow-md transition"
            >
              <div className="flex p-3">
                <div className="mr-3">
                  {character.icon ? (
                    <img
                      src={character.icon}
                      alt={character.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/120?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUser className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{character.name}</h3>
                  <p className="text-sm text-gray-600">
                    {character.title || "No title"}
                  </p>
                  <div className="flex items-center mt-1">
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-1"
                      style={{
                        backgroundColor: getElementColor(character.elementName),
                      }}
                    ></span>
                    <span className="text-xs">{character.elementName}</span>
                    <span className="mx-1 text-gray-300">•</span>
                    <span className="text-xs">{character.weaponType}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-2 flex justify-end space-x-2 border-t">
                <Link
                  to={`/characters/${character.id}`}
                  className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center"
                >
                  <FiEye className="mr-1" size={12} />
                  View
                </Link>
                <Link
                  to={`/characters/edit/${character.id}`}
                  className="text-xs px-2 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 flex items-center"
                >
                  <FiEdit className="mr-1" size={12} />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionCharacters;
