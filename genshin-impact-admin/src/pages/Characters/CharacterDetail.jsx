import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import Layout from "../../components/Layout";
import { characterService } from "../../services";
import CharacterBasicInfo from "./components/CharacterBasicInfo";
import CharacterStats from "./components/CharacterStats";
import CharacterTalents from "./components/CharacterTalents";
import CharacterPassives from "./components/CharacterPassives";
import CharacterConstellations from "./components/CharacterConstellations";

const CharacterDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("basic");
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const data = await characterService.getCharacterById(id);
        setCharacter(data);
        console.log("Character data:", data); // Untuk debugging
      } catch (error) {
        console.error("Error fetching character:", error);
        setError("Failed to load character data");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  // Tabs configuration
  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "stats", label: "Stats" },
    { id: "talents", label: "Talents" },
    { id: "passives", label: "Passives" },
    { id: "constellations", label: "Constellations" },
  ];

  const renderTabContent = () => {
    if (!character) return null;

    switch (activeTab) {
      case "basic":
        return <CharacterBasicInfo character={character} />;
      case "stats":
        return <CharacterStats characterId={character.id} />;
      case "talents":
        return <CharacterTalents characterId={character.id} />;
      case "passives":
        return <CharacterPassives characterId={character.id} />;
      case "constellations":
        return <CharacterConstellations characterId={character.id} />;
      default:
        return <CharacterBasicInfo character={character} />;
    }
  };

  if (loading) {
    return (
      <Layout title="Character Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Character Details">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      </Layout>
    );
  }

  if (!character) {
    return (
      <Layout title="Character Details">
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
          Character not found
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${character.name} - Character Details`}>
      {/* Header with character basic info */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            to="/characters"
            className="mr-4 text-gray-600 hover:text-primary"
          >
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{character.name}</h1>
            {character.title && (
              <p className="text-gray-600">{character.title}</p>
            )}
          </div>
        </div>
        <Link
          to={`/characters/edit/${character.id}`}
          className="btn btn-primary flex items-center"
        >
          <FiEdit className="mr-2" />
          Edit Character
        </Link>
      </div>

      {/* Character summary card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start">
          {/* Character Image */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0 flex justify-center">
            {character.icon ? (
              <img
                src={character.icon}
                alt={character.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                No Image
              </div>
            )}
          </div>

          {/* Character Overview */}
          <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Element</h3>
              {character.element?.elementIcon ? (
                <img
                  src={character.element.elementIcon}
                  alt="Element Icon"
                  className="w-6 h-6"
                />
              ) : (
                <span>None</span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">
                Weapon Type
              </h3>
              <p>{character.weaponType?.weaponTypeName || "None"}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Region</h3>
              <p>{character.region?.regionName || "None"}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Rarity</h3>
              <p>
                {character.rarity ? (
                  <span className="flex">
                    {[...Array(character.rarity.rarityValue)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ★
                      </span>
                    ))}
                  </span>
                ) : (
                  "None"
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">
                Constellation
              </h3>
              <p>{character.constellation || "None"}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Birthday</h3>
              <p>{character.birthday || "Unknown"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderTabContent()}
      </div>
    </Layout>
  );
};

export default CharacterDetail;
