// src/components/cards/WeaponCard.jsx
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { userService } from "../../services";

const WeaponCard = ({ weapon }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!weapon) return null;

  const { id, name, rarity, icon, weaponType, specialProperty } = weapon;

  // Check if weapon is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          // Use userService to check if this weapon is favorited
          const favorited = await userService.checkFavoriteStatus("WEAPON", id);
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
          from: `/weapons/${id}`,
          message: "Please login to add favorites",
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // Find favorite ID then remove using service
        const favoriteId = await userService.findFavoriteId("WEAPON", id);
        if (favoriteId) {
          await userService.removeFromFavorites(favoriteId);
          setIsFavorite(false);
        }
      } else {
        // Add to favorites using service
        await userService.addToFavorites({
          favoriteType: "WEAPON",
          weaponId: id,
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Default color if not provided
  const rarityColor = rarity?.rarityColor || "#6A94BC"; // Default 3-star color

  return (
    <Link to={`/weapons/${id}`} className="block">
      <div
        className="relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        style={{
          background: `linear-gradient(180deg, ${rarityColor} 0%, rgba(0, 0, 0, 0.8) 100%)`,
        }}
      >
        {/* Weapon Type Icon (top right) */}
        {weaponType?.weaponTypeIcon && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 z-20">
            <img
              src={weaponType.weaponTypeIcon}
              alt={weaponType.weaponTypeName}
              className="w-6 h-6"
              title={weaponType.weaponTypeName}
            />
          </div>
        )}

        {/* Favorite Toggle Button */}
        {user && (
          <button
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            className={`absolute top-2 left-2 z-20 w-8 h-8 flex items-center justify-center rounded-full ${
              isLoading ? "opacity-50" : "hover:bg-black hover:bg-opacity-30"
            }`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <svg
              className={`w-5 h-5 ${
                isFavorite ? "text-red-500" : "text-gray-300"
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

        {/* Weapon Image with gradient overlay */}
        <div className="relative h-40 sm:h-48 flex items-center justify-center overflow-hidden">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMyIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMzYgMzRjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bTAtMTBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bS0xMCAwYzAgMSAxIDIgMiAyczItMSAyLTItMS0yLTItMi0yIDEtMiAyem0xMCAyMGMwIDEgMSAyIDIgMnMyLTEgMi0yLTEtMi0yLTItMiAxLTIgMnptLTEwIDBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bS0xMC0xMGMwIDEgMSAyIDIgMnMyLTEgMi0yLTEtMi0yLTItMiAxLTIgMnptMzAtMTBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bS0zMCAwYzAgMSAxIDIgMiAyczItMSAyLTItMS0yLTItMi0yIDEtMiAyem0zMCAyMGMwIDEgMSAyIDIgMnMyLTEgMi0yLTEtMi0yLTItMiAxLTIgMnptLTMwIDBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6Ii8+PC9nPjwvc3ZnPg==')`,
            }}
          ></div>

          <img
            src={icon}
            alt={name}
            className="max-h-full max-w-full object-contain z-10 drop-shadow-lg"
          />

          {/* Rarity Stars (bottom) */}
          <div className="absolute bottom-1 left-0 w-full flex justify-center">
            <div className="flex">
              {[...Array(rarity?.rarityValue || 3)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Weapon Name and Special Property */}
        <div className="py-3 px-3 text-center">
          <h3 className="text-sm font-medium text-white truncate">{name}</h3>
          {weaponType && (
            <p className="text-xs text-gray-300 mt-1">
              {weaponType.weaponTypeName}
            </p>
          )}
          {specialProperty && (
            <p className="text-xs text-yellow-300 mt-1 truncate">
              {specialProperty}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default WeaponCard;
