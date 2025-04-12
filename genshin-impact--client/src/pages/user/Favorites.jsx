import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import CharacterCard from "../../components/cards/CharacterCard";
import WeaponCard from "../../components/cards/WeaponCard";
import Loader from "../../components/common/Loader";

const Favorites = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("characters");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/user/favorites");
        setFavorites(response.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await api.delete(`/user/favorites/${favoriteId}`);
      // Remove from state
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  if (authLoading || loading) return <Loader />;

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">You must be logged in to view this page.</p>
        <a
          href="/login"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Login
        </a>
      </div>
    );
  }

  // Filter favorites by type
  const characterFavorites = favorites.filter(
    (fav) => fav.favoriteType === "CHARACTER"
  );
  const weaponFavorites = favorites.filter(
    (fav) => fav.favoriteType === "WEAPON"
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">My Favorites</h1>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("characters")}
          className={`px-4 py-2 mr-2 font-medium ${
            activeTab === "characters"
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Characters ({characterFavorites.length})
        </button>

        <button
          onClick={() => setActiveTab("weapons")}
          className={`px-4 py-2 font-medium ${
            activeTab === "weapons"
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Weapons ({weaponFavorites.length})
        </button>
      </div>

      {error && (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {activeTab === "characters" && (
        <div>
          {characterFavorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {characterFavorites.map((favorite) => (
                <div key={favorite.id} className="relative group">
                  <CharacterCard character={favorite.character} />

                  {/* Remove button (appears on hover) */}
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from favorites"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400">
                You haven't added any characters to your favorites yet.
              </p>
              <a
                href="/characters"
                className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Browse Characters
              </a>
            </div>
          )}
        </div>
      )}

      {activeTab === "weapons" && (
        <div>
          {weaponFavorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {weaponFavorites.map((favorite) => (
                <div key={favorite.id} className="relative group">
                  <WeaponCard weapon={favorite.weapon} />

                  {/* Remove button (appears on hover) */}
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from favorites"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400">
                You haven't added any weapons to your favorites yet.
              </p>
              <a
                href="/weapons"
                className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Browse Weapons
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;
