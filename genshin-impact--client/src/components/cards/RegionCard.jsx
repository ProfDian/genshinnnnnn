// src/components/cards/RegionCard.jsx
import { Link } from "react-router-dom";

const RegionCard = ({ region }) => {
  if (!region) return null;

  const { id, regionName, regionIcon, overview, associatedElement } = region;

  // Determine background color based on associated element
  let bgColor = "#374151"; // Default gray
  if (associatedElement) {
    switch (associatedElement.toLowerCase()) {
      case "anemo":
        bgColor = "#74C2A8";
        break;
      case "geo":
        bgColor = "#F3B481";
        break;
      case "electro":
        bgColor = "#B08FC2";
        break;
      case "dendro":
        bgColor = "#A5C83B";
        break;
      case "hydro":
        bgColor = "#4CC2F1";
        break;
      case "pyro":
        bgColor = "#EF7938";
        break;
      case "cryo":
        bgColor = "#9FD6E3";
        break;
    }
  }

  return (
    <Link to={`/regions/${id}`} className="block">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
        {/* Region Header with gradient based on element */}
        <div
          className="h-32 relative"
          style={{
            background: `linear-gradient(135deg, ${bgColor} 0%, rgba(0, 0, 0, 0.7) 100%)`,
          }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMyIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMzYgMzRjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bTAtMTBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bS0xMCAwYzAgMSAxIDIgMiAyczItMSAyLTItMS0yLTItMi0yIDEtMiAyem0xMCAyMGMwIDEgMSAyIDIgMnMyLTEgMi0yLTEtMi0yLTItMiAxLTIgMnptLTEwIDBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bS0xMC0xMGMwIDEgMSAyIDIgMnMyLTEgMi0yLTEtMi0yLTItMiAxLTIgMnptMzAtMTBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bS0zMCAwYzAgMSAxIDIgMiAyczItMSAyLTItMS0yLTItMi0yIDEtMiAyem0zMCAyMGMwIDEgMSAyIDIgMnMyLTEgMi0yLTEtMi0yLTItMiAxLTIgMnptLTMwIDBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6Ii8+PC9nPjwvc3ZnPg==')`,
            }}
          ></div>

          {/* Region Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={regionIcon}
              alt={regionName}
              className="h-20 w-20 object-contain drop-shadow-lg"
            />
          </div>

          {/* Element Badge (if available) */}
          {associatedElement && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1 text-xs text-white">
              {associatedElement}
            </div>
          )}
        </div>

        {/* Region Info */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-2">{regionName}</h3>

          {overview && (
            <p className="text-gray-300 text-sm line-clamp-3">{overview}</p>
          )}

          <div className="mt-4 flex justify-end">
            <span className="text-indigo-400 text-sm inline-flex items-center">
              Explore
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RegionCard;
