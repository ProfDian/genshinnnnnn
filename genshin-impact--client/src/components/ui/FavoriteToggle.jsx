import { useState } from "react";

const FavoriteToggle = ({ isFavorite, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-2 rounded-full transition-colors ${
        isFavorite
          ? "text-red-500 hover:bg-red-100 hover:bg-opacity-10"
          : "text-gray-400 hover:text-white hover:bg-gray-700"
      }`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className="w-6 h-6"
        fill={isFavorite || isHovered ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default FavoriteToggle;
