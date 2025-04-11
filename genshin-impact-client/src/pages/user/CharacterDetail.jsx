// src/pages/user/CharacterDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { characterAPI, userAPI } from "../../services/api";
import { FaArrowLeft, FaStar, FaHeart, FaRegHeart } from "react-icons/fa";

export default function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchCharacter();
    checkFavoriteStatus();
  }, [id]);

  async function fetchCharacter() {
    try {
      setLoading(true);
      const data = await characterAPI.getCharacterById(id);
      setCharacter(data);
    } catch (err) {
      console.error("Error fetching character:", err);
      setError("Failed to load character details");
    } finally {
      setLoading(false);
    }
  }

  async function checkFavoriteStatus() {
    try {
      const favorites = await userAPI.getFavorites();
      const isCharacterFavorite = favorites.some(
        (fav) =>
          fav.favoriteType === "CHARACTER" && fav.itemName === character?.name
      );
      setIsFavorite(isCharacterFavorite);
    } catch (err) {
      console.error("Error checking favorite status:", err);
    }
  }

  async function toggleFavorite() {
    try {
      if (isFavorite) {
        // Find the favorite ID and remove it
        const favorites = await userAPI.getFavorites();
        const favorite = favorites.find(
          (fav) =>
            fav.favoriteType === "CHARACTER" && fav.itemName === character?.name
        );

        if (favorite) {
          await userAPI.removeFromFavorites(favorite.favoriteId);
          setIsFavorite(false);
        }
      } else {
        // Add to favorites
        await userAPI.addToFavorites({
          favoriteType: "CHARACTER",
          characterId: character.id,
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading character...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="mt-4 btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Character not found
          </div>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="mt-4 btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="btn btn-secondary flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {character.name}
            </h1>
          </div>
          <button
            onClick={toggleFavorite}
            className="btn flex items-center gap-2"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <>
                <FaHeart className="text-red-500" /> Favorited
              </>
            ) : (
              <>
                <FaRegHeart /> Add to Favorites
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Character Header */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              {character.gachaImg ? (
                <img
                  src={character.gachaImg}
                  alt={character.name}
                  className="w-full h-auto rounded-lg shadow"
                />
              ) : character.icon ? (
                <img
                  src={character.icon}
                  alt={character.name}
                  className="w-full max-w-xs mx-auto rounded-lg shadow"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {character.name}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {character.title || "No title"}
                  </p>
                </div>
                <div className="flex">
                  {Array.from({
                    length: character.rarity?.rarityValue || 0,
                  }).map((_, index) => (
                    <FaStar key={index} className="h-6 w-6 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Element
                  </h3>
                  <p className="text-base text-gray-900">
                    {character.element?.elementName || "Unknown"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Weapon Type
                  </h3>
                  <p className="text-base text-gray-900">
                    {character.weaponType?.weaponTypeName || "Unknown"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Region
                  </h3>
                  <p className="text-base text-gray-900">
                    {character.region?.regionName || "Unknown"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Constellation
                  </h3>
                  <p className="text-base text-gray-900">
                    {character.constellation || "Unknown"}
                  </p>
                </div>
                {character.birthday && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                      Birthday
                    </h3>
                    <p className="text-base text-gray-900">
                      {character.birthday}
                    </p>
                  </div>
                )}
              </div>

              {character.detail && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-500">
                    Description
                  </h3>
                  <p className="text-base text-gray-900 mt-1">
                    {character.detail}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "overview"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "talents"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("talents")}
              >
                Talents
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "constellations"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("constellations")}
              >
                Constellations
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "stats"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("stats")}
              >
                Stats
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  About {character.name}
                </h3>
                <p className="text-gray-700">
                  {character.detail || "No detailed information available."}
                </p>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Voice Actors</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {character.cvEn && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          English
                        </h5>
                        <p className="text-gray-900">{character.cvEn}</p>
                      </div>
                    )}
                    {character.cvJp && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Japanese
                        </h5>
                        <p className="text-gray-900">{character.cvJp}</p>
                      </div>
                    )}
                    {character.cvChs && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Chinese
                        </h5>
                        <p className="text-gray-900">{character.cvChs}</p>
                      </div>
                    )}
                    {character.cvKr && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">
                          Korean
                        </h5>
                        <p className="text-gray-900">{character.cvKr}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "talents" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Talents</h3>
                {character.talents && character.talents.length > 0 ? (
                  <div className="space-y-6">
                    {character.talents.map((talent) => (
                      <div key={talent.id} className="border rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {talent.talentName}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                          <span className="capitalize">
                            {talent.talentType.toLowerCase().replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-gray-700">
                          {talent.talentDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No talent information available.
                  </p>
                )}

                {character.passives && character.passives.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Passive Abilities
                    </h3>
                    <div className="space-y-6">
                      {character.passives.map((passive) => (
                        <div key={passive.id} className="border rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {passive.passiveName}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                            {passive.unlockLevel && (
                              <span>
                                Unlocks at Ascension {passive.unlockLevel}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700">
                            {passive.passiveDescription}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "constellations" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Constellations</h3>
                {character.constellations &&
                character.constellations.length > 0 ? (
                  <div className="space-y-6">
                    {character.constellations
                      .sort(
                        (a, b) => a.constellationLevel - b.constellationLevel
                      )
                      .map((constellation) => (
                        <div
                          key={constellation.id}
                          className="border rounded-lg p-4"
                        >
                          <h4 className="text-lg font-semibold text-gray-800">
                            {constellation.constellationLevel}.{" "}
                            {constellation.constellationName}
                          </h4>
                          <p className="text-gray-700 mt-2">
                            {constellation.constellationDescription}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No constellation information available.
                  </p>
                )}
              </div>
            )}

            {activeTab === "stats" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Character Stats</h3>
                {character.stats && character.stats.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Level
                          </th>
                          <th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ascension
                          </th>
                          <th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Base ATK
                          </th>
                          <th className="border px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {character.stats[0].statType.replace(/_/g, " ")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {character.stats
                          .sort((a, b) => a.level - b.level)
                          .map((stat) => (
                            <tr key={stat.id} className="hover:bg-gray-50">
                              <td className="border px-4 py-2">{stat.level}</td>
                              <td className="border px-4 py-2">
                                {stat.ascension}
                              </td>
                              <td className="border px-4 py-2">
                                {stat.baseAtk}
                              </td>
                              <td className="border px-4 py-2">
                                {stat.statValue}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No stat information available.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
