// WeaponPassives.jsx
import React from "react";

const WeaponPassives = ({ passives }) => {
  if (!passives || passives.length === 0) {
    return (
      <p className="text-center py-4">This weapon has no passive abilities.</p>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Passive Abilities</h3>

      <div className="space-y-4">
        {passives.map((passive, index) => (
          <div key={passive.id || index} className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-primary">
              {passive.passiveName || `Passive ${index + 1}`}
            </h4>
            <p className="mt-2">
              {passive.passiveDescription || "No description available."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaponPassives;
