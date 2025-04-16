import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiMapPin, FiUsers, FiEye } from "react-icons/fi";
import regionService from "../../services/regionService";

// Region card component (more compact design)
const RegionCard = ({ region }) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch character count when component mounts
  useEffect(() => {
    const fetchCharacterCount = async () => {
      try {
        const characters = await regionService.getCharactersByRegion(region.id);
        setCharacterCount(Array.isArray(characters) ? characters.length : 0);
      } catch (error) {
        console.error(
          `Error fetching characters for region ${region.id}:`,
          error
        );
        setCharacterCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterCount();
  }, [region.id]);

  return (
    <div className="card hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        {/* Header with background color based on element */}
        <div
          className="h-20 bg-gradient-to-r flex items-center justify-center p-4"
          style={{
            background: region.associatedElement
              ? `linear-gradient(to right, 
                ${getElementColor(region.associatedElement)}22, 
                ${getElementColor(region.associatedElement)}44)`
              : "linear-gradient(to right, #f0f0f0, #f8f8f8)",
          }}
        >
          <div className="absolute left-4 top-4 flex items-center">
            {region.regionIcon ? (
              <img
                src={region.regionIcon}
                alt={region.regionName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/160?text=No+Image";
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                <FiMapPin size={24} className="text-gray-500" />
              </div>
            )}
          </div>

          <div className="ml-20">
            <h2 className="text-lg font-semibold">{region.regionName}</h2>
            {region.mainCity && (
              <p className="text-sm text-gray-700">{region.mainCity}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {region.archon && (
              <div className="text-sm">
                <span className="text-gray-600 font-medium">Archon:</span>{" "}
                <span className="text-gray-800">{region.archon}</span>
              </div>
            )}

            {region.associatedElement && (
              <div className="text-sm">
                <span className="text-gray-600 font-medium">Element:</span>{" "}
                <div className="inline-flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1"
                    style={{
                      backgroundColor: getElementColor(
                        region.associatedElement
                      ),
                    }}
                  ></span>
                  <span className="text-gray-800">
                    {region.associatedElement}
                  </span>
                </div>
              </div>
            )}
          </div>

          {region.overview && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {region.overview}
            </p>
          )}

          <div className="flex flex-wrap mt-2 gap-2">
            <div className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center">
              <FiMapPin className="mr-1" /> {region.areas?.length || 0} Areas
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center">
              <FiUsers className="mr-1" />
              {isLoading ? (
                <span className="inline-block w-4 animate-pulse bg-gray-200"></span>
              ) : (
                characterCount
              )}{" "}
              Characters
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-end space-x-2">
          <Link
            to={`/regions/edit/${region.id}`}
            className="btn btn-sm btn-primary flex items-center"
          >
            <FiEdit className="mr-1" /> Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

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

export default RegionCard;
