// src/pages/characters/CharacterDetail.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../../components/common/Loader";
import Badge from "../../components/ui/Badge";
import { characterService, userService } from "../../services";

const CharacterDetail = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch character data using characterService
  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use characterService instead of direct API call
        const response = await characterService.getCharacterById(id);
        setCharacter(response.data);

        // After character is loaded, check favorite status
        if (user) {
          checkFavoriteStatus(response.data.id);
        }
      } catch (err) {
        console.error("Error fetching character:", err);
        setError("Failed to load character. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  // Check favorite status separately when user logs in/out
  useEffect(() => {
    if (user && character) {
      checkFavoriteStatus(character.id);
    } else if (!user) {
      setIsFavorite(false);
    }
  }, [user]);

  // Helper function to check if character is in favorites
  const checkFavoriteStatus = async (characterId) => {
    try {
      const favorited = await userService.checkFavoriteStatus(
        "CHARACTER",
        characterId
      );
      setIsFavorite(favorited);
    } catch (err) {
      console.error("Error checking favorite status:", err);
    }
  };

  // Toggle favorite status using userService
  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/characters/${id}`,
          message: "Please login to add favorites",
        },
      });
      return;
    }

    setIsTogglingFavorite(true);

    try {
      if (isFavorite) {
        // Find favorite ID then remove
        const favoriteId = await userService.findFavoriteId("CHARACTER", id);
        if (favoriteId) {
          await userService.removeFromFavorites(favoriteId);
          setIsFavorite(false);
        }
      } else {
        // Add to favorites
        await userService.addToFavorites({
          favoriteType: "CHARACTER",
          characterId: parseInt(id),
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 bg-red-900 bg-opacity-20 rounded-lg border border-red-700">
        <svg
          className="w-12 h-12 text-red-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-300 text-lg">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );

  if (!character) return null;

  const {
    name,
    title,
    detail,
    element,
    weaponType,
    region,
    rarity,
    icon,
    gachaImg,
    stats,
    talents,
    passives,
    constellations,
    cvEn,
    cvJp,
    cvChs,
    cvKr,
    birthday,
    constellation,
  } = character;

  // Get element color for styling
  const getElementColor = () => {
    if (!element?.elementName) return { light: "#4B5563", dark: "#1F2937" };

    switch (element.elementName.toLowerCase()) {
      case "hydro":
        return { light: "#4CC2F1", dark: "#1A91FF" };
      case "pyro":
        return { light: "#EF7938", dark: "#D95A2B" };
      case "cryo":
        return { light: "#9FD6E3", dark: "#74C9DC" };
      case "electro":
        return { light: "#B08FC2", dark: "#9A6CB7" };
      case "anemo":
        return { light: "#74C2A8", dark: "#59B394" };
      case "geo":
        return { light: "#F3B481", dark: "#E9A066" };
      case "dendro":
        return { light: "#A5C83B", dark: "#8BAE25" };
      default:
        return { light: "#4B5563", dark: "#1F2937" };
    }
  };

  const elementColor = getElementColor();

  return (
    <div className="pb-12">
      {/* Hero Section - Character Showcase */}
      <div className="relative mb-8">
        {/* Background with element theme */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${elementColor.dark}90, ${elementColor.light}40)`,
          }}
        >
          {/* Patterned overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTM2IDM0YzAgMSAxIDIgMiAyczItMSAyLTItMS0yLTItMi0yIDEtMiAyem0wLTEwYzAgMSAxIDIgMiAyczItMSAyLTItMS0yLTItMi0yIDEtMiAyem0tMTAgMGMwIDEgMSAyIDIgMnMyLTEgMi0yLTEtMi0yLTItMiAxLTIgMnptMTAgMjBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bS0xMCAwYzAgMSAxIDIgMiAyczItMSAyLTItMS0yLTItMi0yIDEtMiAyem0tMTAtMTBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bTMwLTEwYzAgMSAxIDIgMiAyczItMSAyLTItMS0yLTItMi0yIDEtMiAyem0tMzAgMGMwIDEgMSAyIDIgMnMyLTEgMi0yLTEtMi0yLTItMiAxLTIgMnptMzAgMjBjMCAxIDEgMiAyIDJzMi0xIDItMi0xLTItMi0yLTIgMS0yIDJ6bS0zMCAwYzAgMSAxIDIgMiAyczItMSAyLTItMS0yLTItMi0yIDEtMiAyeiIvPjwvZz48L3N2Zz4=')`,
            }}
          ></div>

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white opacity-10"></div>
        </div>

        {/* Content */}
        <div className="relative p-8 z-10">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left side - Character Image */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-white opacity-20 blur-xl rounded-full"></div>
                <img
                  src={gachaImg || icon}
                  alt={name}
                  className="relative max-h-[400px] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              </div>
            </div>

            {/* Right side - Character Info */}
            <div className="w-full md:w-2/3 mt-6 md:mt-0 md:ml-8 text-white">
              <div className="flex justify-between">
                <div>
                  {/* Rarity display */}
                  <div className="flex mb-2">
                    {[...Array(rarity?.rarityValue || 5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-6 h-6 text-yellow-400 drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Name and title */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {name}
                  </h1>
                  {title && (
                    <p className="text-xl opacity-90 italic">"{title}"</p>
                  )}

                  {/* Constellation */}
                  {constellation && (
                    <p className="text-lg text-gray-300 mt-1">
                      <span className="opacity-70">Constellation:</span>{" "}
                      {constellation}
                    </p>
                  )}
                </div>

                {/* Favorite toggle */}
                <button
                  onClick={handleFavoriteToggle}
                  disabled={isTogglingFavorite}
                  className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70 transition-colors"
                >
                  <svg
                    className={`w-7 h-7 ${
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
              </div>

              {/* Character attributes */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* Element */}
                {element && (
                  <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm text-gray-300 uppercase font-medium tracking-wider mb-2">
                      Element
                    </h3>
                    <div className="flex items-center">
                      {element.elementIcon && (
                        <img
                          src={element.elementIcon}
                          alt={element.elementName}
                          className="w-8 h-8 mr-3"
                        />
                      )}
                      <span className="text-lg font-medium">
                        {element.elementName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Weapon Type */}
                {weaponType && (
                  <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm text-gray-300 uppercase font-medium tracking-wider mb-2">
                      Weapon
                    </h3>
                    <div className="flex items-center">
                      {weaponType.weaponTypeIcon && (
                        <img
                          src={weaponType.weaponTypeIcon}
                          alt={weaponType.weaponTypeName}
                          className="w-8 h-8 mr-3"
                        />
                      )}
                      <span className="text-lg font-medium">
                        {weaponType.weaponTypeName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Region */}
                {region && (
                  <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm text-gray-300 uppercase font-medium tracking-wider mb-2">
                      Region
                    </h3>
                    <div className="flex items-center">
                      {region.regionIcon && (
                        <img
                          src={region.regionIcon}
                          alt={region.regionName}
                          className="w-8 h-8 mr-3"
                        />
                      )}
                      <span className="text-lg font-medium">
                        {region.regionName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Birthday */}
                {birthday && (
                  <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm text-gray-300 uppercase font-medium tracking-wider mb-2">
                      Birthday
                    </h3>
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-white/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-lg font-medium">{birthday}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Actor Section */}
              <div className="mt-6 bg-black bg-opacity-30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                <h3 className="text-sm text-gray-300 uppercase font-medium tracking-wider mb-3">
                  Voice Actors
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {cvEn && (
                    <div>
                      <span className="text-gray-400 text-sm block">
                        English
                      </span>
                      <span className="text-white">{cvEn}</span>
                    </div>
                  )}
                  {cvJp && (
                    <div>
                      <span className="text-gray-400 text-sm block">
                        Japanese
                      </span>
                      <span className="text-white">{cvJp}</span>
                    </div>
                  )}
                  {cvChs && (
                    <div>
                      <span className="text-gray-400 text-sm block">
                        Chinese
                      </span>
                      <span className="text-white">{cvChs}</span>
                    </div>
                  )}
                  {cvKr && (
                    <div>
                      <span className="text-gray-400 text-sm block">
                        Korean
                      </span>
                      <span className="text-white">{cvKr}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio section */}
          {detail && (
            <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-sm p-6 rounded-lg border border-white/10">
              <h3 className="text-sm text-gray-300 uppercase font-medium tracking-wider mb-3">
                Character Bio
              </h3>
              <p className="text-white/90 leading-relaxed">{detail}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 rounded-xl mb-6 overflow-hidden shadow-lg">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-4 font-medium transition-colors flex items-center gap-2
              ${
                activeTab === "overview"
                  ? `text-white`
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            style={
              activeTab === "overview"
                ? { backgroundColor: elementColor.dark }
                : {}
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Overview
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`px-6 py-4 font-medium transition-colors flex items-center gap-2
              ${
                activeTab === "stats"
                  ? `text-white`
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            style={
              activeTab === "stats"
                ? { backgroundColor: elementColor.dark }
                : {}
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Stats
          </button>

          <button
            onClick={() => setActiveTab("talents")}
            className={`px-6 py-4 font-medium transition-colors flex items-center gap-2
              ${
                activeTab === "talents"
                  ? `text-white`
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            style={
              activeTab === "talents"
                ? { backgroundColor: elementColor.dark }
                : {}
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Talents
          </button>

          <button
            onClick={() => setActiveTab("passives")}
            className={`px-6 py-4 font-medium transition-colors flex items-center gap-2
              ${
                activeTab === "passives"
                  ? `text-white`
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            style={
              activeTab === "passives"
                ? { backgroundColor: elementColor.dark }
                : {}
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Passives
          </button>

          <button
            onClick={() => setActiveTab("constellations")}
            className={`px-6 py-4 font-medium transition-colors flex items-center gap-2
              ${
                activeTab === "constellations"
                  ? `text-white`
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            style={
              activeTab === "constellations"
                ? { backgroundColor: elementColor.dark }
                : {}
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            Constellations
          </button>
        </div>
      </div>
      {/* Tab Content */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-700 flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-white/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About {name}
            </h2>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                {detail || "No detailed information available yet."}
              </p>

              {/* Additional overview information */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {region && (
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Native of {region.regionName}
                    </h3>
                    <p className="text-gray-300">
                      {region.overview ||
                        `${name} is from the region of ${region.regionName}.`}
                    </p>
                  </div>
                )}

                {element && (
                  <div
                    className="bg-gray-700 bg-opacity-50 p-4 rounded-lg"
                    style={{ borderLeft: `4px solid ${elementColor.dark}` }}
                  >
                    <h3 className="text-lg font-medium text-white mb-2">
                      {element.elementName} Vision
                    </h3>
                    <p className="text-gray-300">
                      {`${name} wields the power of ${element.elementName}, using it to great effect in combat.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-700 flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-white/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Character Stats
            </h2>

            {stats && stats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-sm text-gray-400 uppercase">
                    <tr>
                      <th className="px-6 py-4 bg-gray-700 rounded-tl-lg">
                        Level
                      </th>
                      <th className="px-6 py-4 bg-gray-700">HP</th>
                      <th className="px-6 py-4 bg-gray-700">ATK</th>
                      <th className="px-6 py-4 bg-gray-700">DEF</th>
                      <th className="px-6 py-4 bg-gray-700 rounded-tr-lg">
                        Bonus
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {stats.map((stat, index) => (
                      <tr
                        key={`${stat.level}-${stat.ascension}`}
                        className={
                          index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                        }
                      >
                        <td className="px-6 py-4 font-medium">
                          Level {stat.level}
                          {stat.ascension > 0 && (
                            <span className="ml-2 px-2 py-1 text-xs rounded bg-gray-700">
                              Ascension {stat.ascension}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {stat.hp.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {stat.baseAtk.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {stat.def.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2 py-1 rounded"
                            style={{
                              backgroundColor: elementColor.dark + "40",
                            }}
                          >
                            {stat.statType.replace(/_/g, " ")}: {stat.statValue}
                            %
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-400">
                  No character statistics are available at this time.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Talents Tab */}
        {activeTab === "talents" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-700 flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-white/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Combat Talents
            </h2>

            {talents && talents.length > 0 ? (
              <div className="space-y-8">
                {talents.map((talent) => (
                  <div
                    key={talent.id}
                    className="bg-gray-700 bg-opacity-50 rounded-xl overflow-hidden shadow-lg border border-gray-600"
                  >
                    <div className="px-6 py-5 flex flex-col md:flex-row">
                      {/* Talent icon - placeholder if not available */}
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <div
                          className="w-16 h-16 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: elementColor.dark }}
                        >
                          <svg
                            className="w-10 h-10 text-white opacity-70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Talent info */}
                      <div className="flex-grow">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {talent.talentName}
                          </h3>
                          <span
                            className="ml-3 px-3 py-1 text-xs rounded-full text-white uppercase tracking-wide"
                            style={{ backgroundColor: elementColor.dark }}
                          >
                            {talent.talentType}
                          </span>
                        </div>

                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {talent.talentDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-400 text-lg">
                  No talent information available for this character.
                </p>
                <p className="text-gray-500 mt-2">
                  Information will be updated soon.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Passives Tab */}
        {activeTab === "passives" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-700 flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-white/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Passive Abilities
            </h2>

            {passives && passives.length > 0 ? (
              <div className="space-y-8">
                {passives.map((passive) => (
                  <div
                    key={passive.id}
                    className="bg-gray-700 bg-opacity-50 rounded-xl overflow-hidden shadow-lg border border-gray-600"
                  >
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">
                          {passive.passiveName}
                        </h3>

                        {passive.unlockLevel && (
                          <span className="px-3 py-1 rounded-full text-sm bg-gray-800 border border-gray-600 text-white">
                            Unlocks at Level {passive.unlockLevel}
                          </span>
                        )}
                      </div>

                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {passive.passiveDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-400 text-lg">
                  No passive abilities available for this character.
                </p>
                <p className="text-gray-500 mt-2">
                  Information will be updated soon.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Constellations Tab */}
        {activeTab === "constellations" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-700 flex items-center">
              <svg
                className="w-7 h-7 mr-3 text-white/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Constellations
            </h2>

            {constellations && constellations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {constellations.map((constellation) => (
                  <div
                    key={constellation.id}
                    className="bg-gray-700 bg-opacity-50 rounded-xl overflow-hidden shadow-lg border border-gray-600 flex flex-col h-full"
                  >
                    <div
                      className="px-4 py-3 text-white font-medium flex items-center justify-between"
                      style={{ backgroundColor: elementColor.dark }}
                    >
                      <span>
                        Constellation {constellation.constellationLevel}
                      </span>
                      <svg
                        className="w-5 h-5 text-white opacity-70"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>

                    <div className="p-5 flex-grow">
                      <div className="flex items-start mb-4">
                        {/* Constellation icon */}
                        {constellation.constellationIcon ? (
                          <img
                            src={constellation.constellationIcon}
                            alt={constellation.constellationName}
                            className="w-16 h-16 mr-4 object-contain"
                          />
                        ) : (
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
                            style={{
                              backgroundColor: elementColor.dark + "40",
                            }}
                          >
                            <svg
                              className="w-10 h-10 text-white opacity-70"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                              />
                            </svg>
                          </div>
                        )}

                        <h3 className="text-lg font-bold text-white">
                          {constellation.constellationName}
                        </h3>
                      </div>

                      <p className="text-gray-300 leading-relaxed">
                        {constellation.constellationDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-700 bg-opacity-50 rounded-lg p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-400 text-lg">
                  No constellation information available for this character.
                </p>
                <p className="text-gray-500 mt-2">
                  Information will be updated soon.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDetail;
