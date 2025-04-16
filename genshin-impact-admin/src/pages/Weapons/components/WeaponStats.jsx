// WeaponStats.jsx
import React, { useState, useEffect } from "react";
import weaponStatService from "../../../services/weaponStatService";

const WeaponStats = ({ weaponId, weaponStats }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Jika weaponStats sudah ada, gunakan itu
        if (weaponStats && weaponStats.length > 0) {
          setStats(sortStats(weaponStats));
        } else {
          // Jika tidak, ambil dari API
          const data = await weaponStatService.getWeaponStats(weaponId);
          setStats(sortStats(data));
        }
      } catch (error) {
        console.error("Error fetching weapon stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [weaponId, weaponStats]);

  // Helper untuk mengurutkan stats berdasarkan level dan ascension
  const sortStats = (statsArray) => {
    return [...statsArray].sort((a, b) => {
      if (a.ascension !== b.ascension) {
        return a.ascension - b.ascension;
      }
      return a.level - b.level;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <p className="text-center py-4">No stats available for this weapon.</p>
    );
  }

  // Group stats by ascension
  const statsByAscension = stats.reduce((acc, stat) => {
    if (!acc[stat.ascension]) {
      acc[stat.ascension] = [];
    }
    acc[stat.ascension].push(stat);
    return acc;
  }, {});

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Weapon Stats Progression</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 text-left">Level</th>
              <th className="py-2 px-3 text-left">Ascension</th>
              <th className="py-2 px-3 text-left">Base ATK</th>
              {stats[0]?.substat_type && (
                <th className="py-2 px-3 text-left">
                  {formatSubstatType(stats[0].substat_type)}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {Object.entries(statsByAscension).map(
              ([ascension, ascensionStats]) => (
                <React.Fragment key={ascension}>
                  {ascensionStats.map((stat, index) => (
                    <tr
                      key={stat.id || index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-2 px-3">{stat.level}</td>
                      <td className="py-2 px-3">{stat.ascension}</td>
                      <td className="py-2 px-3">{stat.base_atk}</td>
                      {stat.substat_type && (
                        <td className="py-2 px-3">
                          {formatSubstatValue(
                            stat.sub_stat_value,
                            stat.substat_type
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                  {/* Add separator between ascension levels */}
                  <tr className="h-2 bg-gray-100">
                    <td colSpan={4}></td>
                  </tr>
                </React.Fragment>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper to format substat type
const formatSubstatType = (type) => {
  if (!type) return "";

  // Replace underscores with spaces and capitalize words
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .replace("Percent", "%");
};

// Helper to format substat value
const formatSubstatValue = (value, type) => {
  if (value === undefined || value === null) return "";

  // For percentage types, add % symbol
  if (type && type.includes("PERCENT")) {
    return `${value}%`;
  }

  // For EM and other flat values, return as is
  return value.toString();
};

export default WeaponStats;
