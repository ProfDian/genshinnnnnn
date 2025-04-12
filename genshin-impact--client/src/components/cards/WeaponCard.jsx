// src/components/cards/WeaponCard.jsx
import { Link } from "react-router-dom";

const WeaponCard = ({ weapon }) => {
  if (!weapon) return null;

  const { id, name, rarity, icon, weaponType } = weapon;

  // Default color if not provided
  const rarityColor = rarity?.color || "#6A94BC"; // Default 3-star color

  return (
    <Link to={`/weapons/${id}`} className="block">
      <div
        className="relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        style={{
          background: `linear-gradient(180deg, ${rarityColor} 0%, rgba(0, 0, 0, 0.8) 100%)`,
        }}
      >
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

          {/* Weapon Type Icon (top right) */}
          {weaponType?.icon && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
              <img
                src={weaponType.icon}
                alt={weaponType.name}
                className="w-6 h-6"
              />
            </div>
          )}

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

        {/* Weapon Name */}
        <div className="py-3 px-3 text-center">
          <h3 className="text-sm font-medium text-white truncate">{name}</h3>
          {weaponType && (
            <p className="text-xs text-gray-300 mt-1">{weaponType.name}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default WeaponCard;
