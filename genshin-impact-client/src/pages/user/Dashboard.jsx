// src/pages/user/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { characterAPI, weaponAPI } from "../../services/api";
import { FaUser, FaStar, FaHeart, FaRegHeart } from "react-icons/fa";

export default function UserDashboard() {
  const [characters, setCharacters] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCharacters();
    fetchWeapons();
    fetchFavorites();
  }, []);

  async function fetchCharacters() {
    try {
      setLoading(true);
      const data = await characterAPI.getAllCharacters();
      console.log(data.characters);
      setCharacters(data.characters);
    } catch (error) {
      console.error("Error fetching characters:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeapons() {
    try {
      setLoading(true);
      const data = await weaponAPI.getAllWeapons();
      console.log(data.weapons);
      setWeapons(data.weapons);
    } catch (error) {
      console.error("Error fetching weapons:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFavorites() {
    try {
      // Implementasi fetch favorite nanti
      setFavorites([]);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleViewCharacter = (id) => {
    navigate(`/user/characters/${id}`);
  };

  const toggleFavorite = (characterId) => {
    // Implementasi toggle favorite nanti
    console.log("Toggle favorite for character:", characterId);
  };

  const isCharacterFavorite = (characterId) => {
    return favorites.some((fav) => fav.characterId === characterId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Genshin Impact</h1>
          <div className="flex items-center gap-4">
            {userInfo && (
              <div className="flex items-center gap-2">
                {userInfo.profileImage ? (
                  <img
                    src={userInfo.profileImage}
                    alt={userInfo.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="text-gray-500" />
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  {userInfo.username}
                </span>
              </div>
            )}
            <button
              onClick={() => navigate("/user/profile")}
              className="btn btn-secondary"
            >
              Profile
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Character Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Characters
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading characters...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200">
                    {character.icon ? (
                      <img
                        src={character.icon}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser className="text-gray-400 text-4xl" />
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(character.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100"
                    >
                      {isCharacterFavorite(character.id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {character.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {character.title || "No title"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">
                          {character.element?.elementName || "Unknown"}
                        </span>
                        <span className="text-sm text-gray-600">
                          {character.weaponType?.weaponTypeName || "Unknown"}
                        </span>
                      </div>
                      <div className="flex">
                        {Array.from({
                          length: character.rarity?.rarityValue || 0,
                        }).map((_, index) => (
                          <FaStar
                            key={index}
                            className="h-4 w-4 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewCharacter(character.id)}
                      className="mt-3 w-full btn btn-primary text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weapon Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Weapons</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading weapons...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {weapons.map((weapon) => (
                <div
                  key={weapon.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200">
                    {weapon.icon ? (
                      <img
                        src={weapon.icon}
                        alt={weapon.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaStar className="text-gray-400 text-4xl" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {weapon.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {weapon.weaponType.weaponTypeName || "Unknown Type"}
                    </p>
                    <div className="flex">
                      {Array.from({ length: weapon.rarity || 0 }).map(
                        (_, index) => (
                          <FaStar
                            key={index}
                            className="h-4 w-4 text-yellow-400"
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
