import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import CharacterCard from "../../components/cards/CharacterCard";
import Loader from "../../components/common/Loader";

const RegionDetail = () => {
  const { id } = useParams();
  const [region, setRegion] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchRegionData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [regionResponse, charactersResponse] = await Promise.all([
          api.get(`/regions/${id}`),
          api.get(`/regions/${id}/characters`),
        ]);

        setRegion(regionResponse.data);
        setCharacters(charactersResponse.data);
        console.log(regionResponse.data);
        console.log(charactersResponse.data);
      } catch (err) {
        console.error("Error fetching region data:", err);
        setError("Failed to load region data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegionData();
  }, [id]);

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

  if (!region) return null;

  const {
    regionName,
    overview,
    worldMap,
    archonQuest,
    associatedElement,
    archon,
    ideal,
    mainCity,
    controllingEntity,
    celebratedFestivals,
    howToAccess,
    regionIcon,
    areas,
    features,
  } = region;

  return (
    <div className="pb-10">
      {/* Region Header */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row p-6">
          {/* Region Image */}
          <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
            <img
              src={regionIcon}
              alt={regionName}
              className="max-h-72 object-contain"
            />
          </div>

          {/* Region Info */}
          <div className="w-full md:w-2/3 text-white">
            <h1 className="text-4xl font-bold">{regionName}</h1>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {associatedElement && (
                <div>
                  <h3 className="text-sm text-gray-400">Associated Element</h3>
                  <span>{associatedElement}</span>
                </div>
              )}

              {archon && (
                <div>
                  <h3 className="text-sm text-gray-400">Archon</h3>
                  <span>{archon}</span>
                </div>
              )}

              {ideal && (
                <div>
                  <h3 className="text-sm text-gray-400">Ideal</h3>
                  <span>{ideal}</span>
                </div>
              )}

              {mainCity && (
                <div>
                  <h3 className="text-sm text-gray-400">Main City</h3>
                  <span>{mainCity}</span>
                </div>
              )}
            </div>

            {/* Region overview */}
            {overview && (
              <div className="mt-6">
                <h3 className="text-sm text-gray-400 mb-2">Overview</h3>
                <p className="text-gray-300">{overview}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "overview"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("areas")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "areas"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Areas
          </button>

          <button
            onClick={() => setActiveTab("features")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "features"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Features
          </button>

          <button
            onClick={() => setActiveTab("characters")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "characters"
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Characters
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 rounded-lg p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              About {regionName}
            </h2>

            <div className="space-y-6">
              {overview && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Overview
                  </h3>
                  <p className="text-gray-300">{overview}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {archonQuest && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Archon Quest
                    </h3>
                    <p className="text-gray-300">{archonQuest}</p>
                  </div>
                )}

                {controllingEntity && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Controlling Entity
                    </h3>
                    <p className="text-gray-300">{controllingEntity}</p>
                  </div>
                )}
              </div>

              {celebratedFestivals && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Celebrated Festivals
                  </h3>
                  <p className="text-gray-300">{celebratedFestivals}</p>
                </div>
              )}

              {howToAccess && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    How to Access
                  </h3>
                  <p className="text-gray-300">{howToAccess}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Areas Tab */}
        {activeTab === "areas" && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              Areas in {regionName}
            </h2>

            {areas && areas.length > 0 ? (
              <div className="space-y-8">
                {areas.map((area) => (
                  <div
                    key={area.id}
                    className="bg-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {area.areaImage && (
                        <div className="w-full md:w-1/3">
                          <img
                            src={area.areaImage}
                            alt={area.areaName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <h3 className="text-lg font-medium text-white mb-2">
                          {area.areaName}
                        </h3>
                        {area.areaDescription && (
                          <p className="text-gray-300">
                            {area.areaDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                No areas available for this region.
              </p>
            )}
          </div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              Features of {regionName}
            </h2>

            {features && features.length > 0 ? (
              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.id} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">
                      {feature.featureName}
                    </h3>
                    {feature.featureDescription && (
                      <p className="text-gray-300">
                        {feature.featureDescription}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                No special features available for this region.
              </p>
            )}
          </div>
        )}

        {/* Characters Tab */}
        {activeTab === "characters" && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              Characters from {regionName}
            </h2>

            {characters && characters.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {characters.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                No characters available from this region.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionDetail;
