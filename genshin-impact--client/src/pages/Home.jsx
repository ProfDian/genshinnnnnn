// src/pages/Home.jsx - Versi yang Ditingkatkan
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import CharacterCard from "../components/cards/CharacterCard";
import WeaponCard from "../components/cards/WeaponCard";
import RegionCard from "../components/cards/RegionCard";
import SearchBar from "../components/common/SearchBar";
import Loader from "../components/common/Loader";

const Home = () => {
  const [featuredData, setFeaturedData] = useState({
    characters: [],
    weapons: [],
    regions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [charactersRes, weaponsRes, regionsRes] = await Promise.all([
          api.get("/characters", { params: { limit: 6 } }),
          api.get("/weapons", { params: { limit: 4 } }),
          api.get("/regions"),
        ]);

        setFeaturedData({
          characters: charactersRes.data.characters,
          weapons: weaponsRes.data.weapons,
          regions: regionsRes.data.slice(0, 3),
        });
      } catch (err) {
        console.error("Error fetching featured data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

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

  return (
    <div className="space-y-16">
      {/* Hero Section - Lebih dramatis */}
      <div className="relative h-[500px] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden rounded-xl">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt8d9bc0dfc1b45a2d/6364a40d12dc244b2acba5a9/genshin-impact-3-2-key-art.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Genshin Impact <span className="text-indigo-400">Database</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
            Explore the vast world of Teyvat with detailed information on
            characters, weapons, and regions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/characters"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-md font-medium transform transition duration-200 hover:scale-105"
            >
              View Characters
            </Link>
            <Link
              to="/weapons"
              className="bg-gray-800 hover:bg-gray-700 text-white border border-indigo-500 px-8 py-4 rounded-md font-medium transform transition duration-200 hover:scale-105"
            >
              Browse Weapons
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Characters - Grid layout yang lebih menarik */}
      <div className="featured-section">
        <div className="flex items-center mb-6">
          <div className="h-1 bg-indigo-500 w-12 mr-4"></div>
          <h2 className="text-3xl font-bold text-white">Featured Characters</h2>
          <div className="ml-auto">
            <Link
              to="/characters"
              className="text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              View All
              <svg
                className="w-5 h-5 ml-1"
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
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
          {featuredData.characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </div>

      {/* Featured Weapons - Layout yang lebih menarik */}
      <div className="featured-section">
        <div className="flex items-center mb-6">
          <div className="h-1 bg-indigo-500 w-12 mr-4"></div>
          <h2 className="text-3xl font-bold text-white">Featured Weapons</h2>
          <div className="ml-auto">
            <Link
              to="/weapons"
              className="text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              View All
              <svg
                className="w-5 h-5 ml-1"
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
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredData.weapons.map((weapon) => (
            <WeaponCard key={weapon.id} weapon={weapon} />
          ))}
        </div>
      </div>

      {/* Regions - Desain yang lebih elegan */}
      <div className="featured-section">
        <div className="flex items-center mb-6">
          <div className="h-1 bg-indigo-500 w-12 mr-4"></div>
          <h2 className="text-3xl font-bold text-white">Explore Regions</h2>
          <div className="ml-auto">
            <Link
              to="/regions"
              className="text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              View All
              <svg
                className="w-5 h-5 ml-1"
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
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredData.regions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
