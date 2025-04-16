import React from "react";

const CharacterBasicInfo = ({ character }) => {
  // Function to determine element color
  const getElementColor = (element) => {
    if (!element) return "bg-gray-100 text-gray-800";

    const elementColors = {
      Pyro: "bg-red-100 text-red-700 border-red-300",
      Hydro: "bg-blue-100 text-blue-700 border-blue-300",
      Anemo: "bg-teal-100 text-teal-700 border-teal-300",
      Electro: "bg-purple-100 text-purple-700 border-purple-300",
      Dendro: "bg-green-100 text-green-700 border-green-300",
      Cryo: "bg-cyan-100 text-cyan-700 border-cyan-300",
      Geo: "bg-yellow-100 text-yellow-700 border-yellow-300",
    };

    return (
      elementColors[element.elementName] ||
      "bg-gray-100 text-gray-800 border-gray-300"
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Basic Information
      </h2>

      {/* Character Attributes Card */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Element */}
          {character.element && (
            <div className="flex flex-col items-center justify-center">
              <div
                className={`flex items-center justify-center p-2 rounded-full w-12 h-12 mb-2 ${getElementColor(
                  character.element
                )}`}
              >
                {character.element.elementIcon ? (
                  <img
                    src={character.element.elementIcon}
                    alt={character.element.elementName}
                    className="w-8 h-8"
                  />
                ) : (
                  <span className="text-lg font-semibold">
                    {character.element.elementName?.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">
                {character.element.elementName}
              </span>
              <span className="text-xs text-gray-500">Element</span>
            </div>
          )}

          {/* Weapon Type */}
          {character.weaponType && (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center p-2 rounded-full w-12 h-12 mb-2 bg-gray-200 text-gray-700 border border-gray-300">
                {character.weaponType.weaponTypeIcon ? (
                  <img
                    src={character.weaponType.weaponTypeIcon}
                    alt={character.weaponType.weaponTypeName}
                    className="w-8 h-8"
                  />
                ) : (
                  <span className="text-lg font-semibold">
                    {character.weaponType.weaponTypeName?.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">
                {character.weaponType.weaponTypeName}
              </span>
              <span className="text-xs text-gray-500">Weapon</span>
            </div>
          )}

          {/* Region */}
          {character.region && (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center p-2 rounded-full w-12 h-12 mb-2 bg-indigo-100 text-indigo-700 border border-indigo-300">
                {character.region.regionIcon ? (
                  <img
                    src={character.region.regionIcon}
                    alt={character.region.regionName}
                    className="w-8 h-8"
                  />
                ) : (
                  <span className="text-lg font-semibold">
                    {character.region.regionName?.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">
                {character.region.regionName}
              </span>
              <span className="text-xs text-gray-500">Region</span>
            </div>
          )}

          {/* Rarity */}
          {character.rarity && (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center p-2 rounded-full w-12 h-12 mb-2 bg-amber-100 text-amber-700 border border-amber-300">
                <span className="text-lg font-bold">
                  {character.rarity.rarityValue}
                </span>
              </div>
              <div className="flex">
                {[...Array(character.rarity.rarityValue)].map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">Rarity</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Character Description */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Description
          </h3>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {character.detail || "No description available."}
          </p>

          {/* Constellation */}
          {character.constellation && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-md font-medium text-gray-800 mb-1">
                Constellation
              </h4>
              <p className="text-gray-700">{character.constellation}</p>
            </div>
          )}
        </div>

        {/* Gacha Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          {character.gachaImg ? (
            <div className="relative">
              <img
                src={character.gachaImg}
                alt={`${character.name} full image`}
                className="w-full object-cover h-80 object-top"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                <h3 className="text-xl font-bold text-white">
                  {character.name}
                </h3>
                {character.title && (
                  <p className="text-gray-200">{character.title}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-80 bg-gray-200 flex items-center justify-center p-4">
              <div className="text-center">
                <p className="text-gray-500 mb-2">
                  No character image available
                </p>
                <h3 className="text-xl font-bold text-gray-700">
                  {character.name}
                </h3>
                {character.title && (
                  <p className="text-gray-500">{character.title}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voice Actors */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
          Voice Actors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {character.cvEn && (
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
              <h4 className="font-medium text-blue-700 mb-1">English</h4>
              <p className="text-gray-800">{character.cvEn}</p>
            </div>
          )}

          {character.cvJp && (
            <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
              <h4 className="font-medium text-red-700 mb-1">Japanese</h4>
              <p className="text-gray-800">{character.cvJp}</p>
            </div>
          )}

          {character.cvChs && (
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
              <h4 className="font-medium text-yellow-700 mb-1">Chinese</h4>
              <p className="text-gray-800">{character.cvChs}</p>
            </div>
          )}

          {character.cvKr && (
            <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
              <h4 className="font-medium text-green-700 mb-1">Korean</h4>
              <p className="text-gray-800">{character.cvKr}</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {character.native && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                Native/Affiliation
              </h4>
              <p className="text-gray-800 font-medium">{character.native}</p>
            </div>
          )}

          {character.releaseDate && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                Release Date
              </h4>
              <p className="text-gray-800 font-medium">
                {new Date(Number(character.releaseDate)).toLocaleDateString()}
              </p>
            </div>
          )}

          {character.birthday && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-1">
                Birthday
              </h4>
              <p className="text-gray-800 font-medium">{character.birthday}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterBasicInfo;
