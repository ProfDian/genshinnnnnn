// WeaponBasicInfo.jsx
import React from "react";

const WeaponBasicInfo = ({ weapon }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        {weapon.icon ? (
          <img
            src={weapon.icon}
            alt={weapon.name}
            className="w-full max-w-xs mx-auto rounded-lg"
          />
        ) : (
          <div className="w-full max-w-xs mx-auto h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      <div className="md:col-span-2 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Description</h3>
          <p className="mt-1">
            {weapon.description || "No description available."}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Type</h3>
          <p className="mt-1">
            {weapon.weaponType?.weaponTypeName || "Unknown"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Rarity</h3>
          <div className="flex mt-1">
            {[...Array(weapon.rarity?.rarityValue || 0)].map((_, index) => (
              <span key={index} className="text-yellow-500">
                ★
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Secondary Stat</h3>
          <p className="mt-1">{weapon.specialProperty || "None"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Lore</h3>
          <p className="mt-1">{weapon.story || "No lore available."}</p>
        </div>
      </div>
    </div>
  );
};

export default WeaponBasicInfo;
