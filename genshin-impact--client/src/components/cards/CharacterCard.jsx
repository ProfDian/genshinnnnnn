// src/components/cards/CharacterCard.jsx
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { userService } from "../../services";

const CharacterCard = ({ character }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Destructure character data for easy access
  const { id, name, title, icon, element, rarity, weaponType, constellation } =
    character;

  // Check if character is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          // Use userService to check if this character is favorited
          const favorited = await userService.checkFavoriteStatus(
            "CHARACTER",
            id
          );
          setIsFavorite(favorited);
        } catch (err) {
          console.error("Error checking favorite status:", err);
        }
      }
    };

    checkFavoriteStatus();
  }, [id, user]);

  // Handle favorite toggle using userService
  const handleFavoriteToggle = async (e) => {
    e.preventDefault(); // Prevent card link click
    e.stopPropagation();

    if (!user) {
      // Redirect to login if not logged in
      navigate("/login", {
        state: {
          from: `/characters/${id}`,
          message: "Please login to add favorites",
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // Find favorite ID then remove using service
        const favoriteId = await userService.findFavoriteId("CHARACTER", id);
        if (favoriteId) {
          await userService.removeFromFavorites(favoriteId);
          setIsFavorite(false);
        }
      } else {
        // Add to favorites using service
        await userService.addToFavorites({
          favoriteType: "CHARACTER",
          characterId: id,
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get rarity stars
  const getRarityStars = (value) => {
    return "★".repeat(value);
  };

  // Get element-specific background color
  const getElementColor = () => {
    if (!element?.elementName) return "#4B5563";

    switch (element.elementName.toLowerCase()) {
      case "hydro":
        return "#1A91FF";
      case "pyro":
        return "#D95A2B";
      case "cryo":
        return "#74C9DC";
      case "electro":
        return "#9A6CB7";
      case "anemo":
        return "#59B394";
      case "geo":
        return "#E9A066";
      case "dendro":
        return "#8BAE25";
      default:
        return "#4B5563";
    }
  };

  // Get element-specific text color
  const getElementTextColor = () => {
    if (!element?.elementName) return "#9CA3AF";

    switch (element.elementName.toLowerCase()) {
      case "hydro":
        return "#90CFFF";
      case "pyro":
        return "#FFAC8C";
      case "cryo":
        return "#B8E6F5";
      case "electro":
        return "#D9C2E5";
      case "anemo":
        return "#A7E0D0";
      case "geo":
        return "#FFDBB4";
      case "dendro":
        return "#D3EF89";
      default:
        return "#9CA3AF";
    }
  };

  return (
    <Link to={`/characters/${id}`} className="block group">
      <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-gray-500 transition duration-300 h-full">
        {/* Element Icon in Top Right */}
        {element && element.elementIcon && (
          <div className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-1">
            <img
              src={element.elementIcon}
              alt={element.elementName}
              className="w-6 h-6 object-contain"
              title={element.elementName}
            />
          </div>
        )}

        {/* Favorite Toggle */}
        {user && (
          <button
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            className={`absolute top-2 left-2 z-10 w-8 h-8 flex items-center justify-center rounded-full ${
              isLoading ? "opacity-50" : "hover:bg-black hover:bg-opacity-30"
            }`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <svg
              className={`w-5 h-5 ${
                isFavorite ? "text-red-500" : "text-gray-400"
              } transition-colors duration-200`}
              fill={isFavorite ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isFavorite ? 0 : 2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}

        {/* Character Image */}
        <div
          className="h-44 flex items-end justify-center p-2"
          style={{
            background: `linear-gradient(to top, rgba(26, 32, 44, 0.9), rgba(26, 32, 44, 0.5)), 
                        linear-gradient(to bottom, ${getElementColor()}40, transparent)`,
          }}
        >
          <img
            src={icon}
            alt={name}
            className="h-40 object-contain transition-transform group-hover:scale-105"
          />
        </div>

        {/* Character Info */}
        <div className="p-3">
          {/* Rarity Stars */}
          <div className="text-yellow-400 text-sm mb-1">
            {getRarityStars(rarity?.rarityValue || 0)}
          </div>

          {/* Character Name */}
          <h3 className="text-white font-medium truncate">{name}</h3>

          {/* Character Title */}
          {title && (
            <p className="text-gray-400 text-xs truncate italic">{title}</p>
          )}

          {/* Character Details (Weapon Type & Constellation) */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {/* Weapon Type */}
            {weaponType && (
              <div className="flex items-center">
                {weaponType.weaponTypeIcon ? (
                  <img
                    src={weaponType.weaponTypeIcon}
                    alt={weaponType.weaponTypeName}
                    className="w-4 h-4 mr-1"
                  />
                ) : (
                  <span className="mr-1">🗡️</span>
                )}
                <span className="text-gray-400">
                  {weaponType.weaponTypeName}
                </span>
              </div>
            )}

            {/* Constellation */}
            {constellation && (
              <div className="flex items-center">
                <span className="mr-1">✨</span>
                <span
                  className="text-gray-400"
                  style={{ color: getElementTextColor() }}
                >
                  {constellation}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Element Hint at Bottom */}
        {element && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: getElementColor() }}
          />
        )}
      </div>
    </Link>
  );
};

export default CharacterCard;
