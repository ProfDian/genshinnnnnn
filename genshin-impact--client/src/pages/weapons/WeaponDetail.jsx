// src/pages/weapons/WeaponDetail.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../../components/common/Loader";
import FavoriteToggle from "../../components/ui/FavoriteToggle";

const WeaponDetail = () => {
  const { id } = useParams();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeapon = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/weapons/${id}`);
        setWeapon(response.data);

        // Check if weapon is in user favorites
        if (user) {
          const favoritesResponse = await api.get("/user/favorites");
          const isWeaponFavorite = favoritesResponse.data.some(
            (fav) =>
              fav.favoriteType === "WEAPON" && fav.weapon?.id === parseInt(id)
          );
          setIsFavorite(isWeaponFavorite);
        }
      } catch (err) {
        console.error("Error fetching weapon:", err);
        setError("Failed to load weapon. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeapon();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate("/login", { state: { returnUrl: `/weapons/${id}` } });
      return;
    }

    try {
      if (isFavorite) {
        // Find favorite id and remove it
        const favoritesResponse = await api.get("/user/favorites");
        const favorite = favoritesResponse.data.find(
          (fav) =>
            fav.favoriteType === "WEAPON" && fav.weapon?.id === parseInt(id)
        );

        if (favorite) {
          await api.delete(`/user/favorites/${favorite.id}`);
          setIsFavorite(false);
        }
      } else {
        // Add to favorites
        await api.post("/user/favorites", {
          favoriteType: "WEAPON",
          weaponId: id,
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weapon) return null;

  const {
    name,
    description,
    weaponType,
    rarity,
    specialProperty,
    icon,
    story,
    weapon_stats,
    passives,
    refinements,
  } = weapon;

  // Get rarity color
  const getRarityColor = () => {
    if (!rarity?.rarityValue) return { light: "#6A94BC", dark: "#4A7094" }; // Default

    switch (parseInt(rarity.rarityValue)) {
      case 5:
        return { light: "#BD6932", dark: "#9D4C1A" }; // 5-star
      case 4:
        return { light: "#A256E1", dark: "#7A32B9" }; // 4-star
      case 3:
        return { light: "#6A94BC", dark: "#4A7094" }; // 3-star
      case 2:
        return { light: "#529988", dark: "#3D7A6C" }; // 2-star
      case 1:
        return { light: "#8E8E8E", dark: "#6E6E6E" }; // 1-star
      default:
        return { light: "#6A94BC", dark: "#4A7094" };
    }
  };

  const rarityColor = getRarityColor();

  return (
    <div className="pb-12">
      {/* Hero Section - Redesigned */}
      <div className="relative mb-8">
        {/* Background with rarity theme */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${rarityColor.dark}90, ${rarityColor.light}40)`,
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
            {/* Left side - Weapon Image */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-white opacity-20 blur-xl rounded-full"></div>
                <img
                  src={icon}
                  alt={name}
                  className="relative max-h-[400px] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              </div>
            </div>

            {/* Right side - Weapon Info */}
            <div className="w-full md:w-2/3 mt-6 md:mt-0 md:ml-8 text-white">
              <div className="flex justify-between">
                <div>
                  {/* Rarity display */}
                  <div className="flex mb-2">
                    {[...Array(rarity?.rarityValue || 3)].map((_, i) => (
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

                  {/* Name */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {name}
                  </h1>
                </div>

                {/* Favorite toggle */}
                <FavoriteToggle
                  isFavorite={isFavorite}
                  onToggle={handleFavoriteToggle}
                  size="lg"
                />
              </div>

              {/* Weapon attributes */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* Weapon Type */}
                {weaponType && (
                  <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm text-gray-300 uppercase font-medium tracking-wider mb-2">
                      Weapon Type
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

                {/* Special Property */}
                {specialProperty && (
                  <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <h3 className="text-sm text-gray-300 uppercase font-medium tracking-wider mb-2">
                      Special Property
                    </h3>
                    <span className="text-lg font-medium">
                      {specialProperty}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {description && (
                <div className="mt-6 bg-black bg-opacity-30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                  <p className="text-white/80 leading-relaxed">{description}</p>
                </div>
              )}
            </div>
          </div>
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
                  ? "text-white bg-gray-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
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
                  ? "text-white bg-gray-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
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
            onClick={() => setActiveTab("passives")}
            className={`px-6 py-4 font-medium transition-colors flex items-center gap-2
              ${
                activeTab === "passives"
                  ? "text-white bg-gray-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
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
            Passive
          </button>

          <button
            onClick={() => setActiveTab("refinements")}
            className={`px-6 py-4 font-medium transition-colors flex items-center gap-2
              ${
                activeTab === "refinements"
                  ? "text-white bg-gray-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
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
            Refinements
          </button>

          {story && (
            <button
              onClick={() => setActiveTab("story")}
              className={`px-6 py-4 font-medium transition-colors flex items-center gap-2
                ${
                  activeTab === "story"
                    ? "text-white bg-gray-700"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Story
            </button>
          )}
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

            <div className="space-y-6">
              {description && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weapon Type */}
                {weaponType && (
                  <div className="bg-gray-700 bg-opacity-40 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Weapon Type
                    </h3>
                    <div className="flex items-center">
                      {weaponType.weaponTypeIcon && (
                        <img
                          src={weaponType.weaponTypeIcon}
                          alt=""
                          className="w-6 h-6 mr-2"
                        />
                      )}
                      <span className="text-gray-300">
                        {weaponType.weaponTypeName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Rarity */}
                <div className="bg-gray-700 bg-opacity-40 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Rarity
                  </h3>
                  <div className="flex">
                    {[...Array(rarity?.rarityValue || 3)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Property */}
              {specialProperty && (
                <div className="bg-gray-700 bg-opacity-40 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Special Property
                  </h3>
                  <p className="text-gray-300">{specialProperty}</p>
                </div>
              )}
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
              Weapon Stats
            </h2>

            {weapon_stats && weapon_stats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-sm text-gray-400 uppercase">
                    <tr>
                      <th className="px-6 py-4 bg-gray-700 rounded-tl-lg">
                        Level
                      </th>
                      <th className="px-6 py-4 bg-gray-700">Base ATK</th>
                      {weapon_stats[0].substat_type && (
                        <th className="px-6 py-4 bg-gray-700 rounded-tr-lg">
                          {weapon_stats[0].substat_type.replace(/_/g, " ")}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {weapon_stats.map((stat, index) => (
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
                        <td className="px-6 py-4">{stat.base_atk}</td>
                        {stat.substat_type && (
                          <td className="px-6 py-4">
                            <span
                              className="px-2 py-1 rounded"
                              style={{
                                backgroundColor: rarityColor.dark + "40",
                              }}
                            >
                              {stat.sub_stat_value}
                              {stat.substat_type.includes("PERCENT") ? "%" : ""}
                            </span>
                          </td>
                        )}
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-gray-400">
                  No stats information available for this weapon.
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Passive Ability
            </h2>

            {passives && passives.length > 0 ? (
              <div className="space-y-6">
                {passives.map((passive) => (
                  <div
                    key={passive.id}
                    className="bg-gray-700 bg-opacity-50 rounded-lg overflow-hidden shadow-lg border border-gray-600"
                  >
                    <div
                      className="px-4 py-3 text-white font-medium"
                      style={{ backgroundColor: rarityColor.dark }}
                    >
                      {passive.passiveName}
                    </div>
                    <div className="p-5">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {passive.passiveDescription}
                      </p>
                    </div>
                  </div>
                ))}
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-gray-400">
                  This weapon doesn't have a passive ability.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Refinements Tab */}
        {activeTab === "refinements" && (
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
              Refinement Ranks
            </h2>

            {refinements && refinements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {refinements.map((refinement) => (
                  <div
                    key={refinement.id}
                    className="bg-gray-700 bg-opacity-50 rounded-lg overflow-hidden shadow-lg border border-gray-600"
                  >
                    <div
                      className="px-4 py-3 text-white font-medium flex items-center justify-between"
                      style={{ backgroundColor: rarityColor.dark }}
                    >
                      <span>Refinement Rank {refinement.refinementLevel}</span>
                      <span className="flex">
                        {[...Array(refinement.refinementLevel)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {refinement.refinementDescription}
                      </p>
                    </div>
                  </div>
                ))}
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-gray-400">
                  No refinement information available for this weapon.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Story Tab */}
        {activeTab === "story" && story && (
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Weapon Story
            </h2>

            <div className="bg-gray-700 bg-opacity-50 rounded-lg p-6 border border-gray-600">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {story}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeaponDetail;
