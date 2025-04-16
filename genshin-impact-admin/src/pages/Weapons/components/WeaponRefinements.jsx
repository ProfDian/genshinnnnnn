// WeaponRefinements.jsx
import React from "react";

const WeaponRefinements = ({ refinements }) => {
  if (!refinements || refinements.length === 0) {
    return (
      <p className="text-center py-4">
        No refinement information available for this weapon.
      </p>
    );
  }

  // Sort refinements by level
  const sortedRefinements = [...refinements].sort(
    (a, b) => a.refinementLevel - b.refinementLevel
  );

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Refinement Effects</h3>

      <div className="space-y-4">
        {sortedRefinements.map((refinement) => (
          <div key={refinement.id} className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-primary">
              Refinement Rank {refinement.refinementLevel}
            </h4>
            <p className="mt-2">
              {refinement.refinementDescription || "No description available."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaponRefinements;
