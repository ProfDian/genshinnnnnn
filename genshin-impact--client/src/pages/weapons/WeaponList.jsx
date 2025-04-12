// src/pages/weapons/WeaponList.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import WeaponCard from "../../components/cards/WeaponCard";
import SearchBar from "../../components/common/SearchBar";
import FilterGroup from "../../components/common/FilterGroup";
import Loader from "../../components/common/Loader";

const WeaponList = () => {
  const [weapons, setWeapons] = useState([]);
  const [weaponTypes, setWeaponTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    weaponTypeId: "",
    rarityId: "",
    sortBy: "name",
    sortOrder: "asc",
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    // Fetch weapon types for filters
    const fetchWeaponTypes = async () => {
      try {
        const weaponTypesRes = await api.get("/weapon-types");

        setWeaponTypes(
          weaponTypesRes.data.map((wt) => ({
            value: wt.id,
            label: wt.weaponTypeName,
            icon: wt.weaponTypeIcon,
          }))
        );
      } catch (err) {
        console.error("Error fetching weapon types:", err);
      }
    };

    fetchWeaponTypes();
  }, []);

  useEffect(() => {
    // Fetch weapons with current filters and pagination
    const fetchWeapons = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          ...filters,
          page: pagination.currentPage,
          limit: 20,
        };

        const response = await api.get("/weapons", { params });
        setWeapons(response.data.weapons);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Error fetching weapons:", err);
        setError("Failed to load weapons. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeapons();
  }, [filters, pagination.currentPage]);

  const handleSearch = (searchQuery) => {
    setFilters({
      ...filters,
      search: searchQuery,
    });
    // Reset to first page when searching
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  };

  const handleFilterChange = (filterName, value) => {
    // Toggle filter if clicking the same value
    const newValue = filters[filterName] === value ? "" : value;

    setFilters({
      ...filters,
      [filterName]: newValue,
    });

    // Reset to first page when changing filters
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPage: newPage,
    });
    // Scroll to top on page change
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Weapons</h1>
        <p className="text-gray-400">
          Browse and search for weapons in Genshin Impact
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-white text-sm font-medium mb-2">
              Weapon Types
            </h3>
            <div className="flex flex-wrap gap-2">
              {weaponTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleFilterChange("weaponTypeId", type.value)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.weaponTypeId === type.value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {type.icon && (
                    <img src={type.icon} alt="" className="w-4 h-4 mr-1" />
                  )}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white text-sm font-medium mb-2">Rarity</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "5", label: "⭐⭐⭐⭐⭐", color: "#BD6932" },
                { value: "4", label: "⭐⭐⭐⭐", color: "#A256E1" },
                { value: "3", label: "⭐⭐⭐", color: "#6A94BC" },
              ].map((rarity) => (
                <button
                  key={rarity.value}
                  onClick={() => handleFilterChange("rarityId", rarity.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.rarityId === rarity.value
                      ? "text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  style={{
                    backgroundColor:
                      filters.rarityId === rarity.value
                        ? rarity.color
                        : undefined,
                  }}
                >
                  {rarity.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white text-sm font-medium mb-2">Sort By</h3>
            <select
              className="bg-gray-700 text-white rounded-md py-2 px-3 w-full"
              value={`${filters.sortBy},${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split(",");
                setFilters({
                  ...filters,
                  sortBy,
                  sortOrder,
                });
              }}
            >
              <option value="name,asc">Name (A-Z)</option>
              <option value="name,desc">Name (Z-A)</option>
              <option value="baseAtk,asc">Base ATK (Low-High)</option>
              <option value="baseAtk,desc">Base ATK (High-Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && <Loader />}

      {/* Error state */}
      {error && (
        <div className="text-center py-10 bg-red-900 bg-opacity-20 rounded-lg border border-red-700">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Weapon Grid */}
      {!loading && !error && (
        <>
          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400">
              Showing {weapons.length} of {pagination.totalItems} weapons
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {weapons.map((weapon) => (
              <WeaponCard key={weapon.id} weapon={weapon} />
            ))}
          </div>

          {/* No results */}
          {weapons.length === 0 && (
            <div className="text-center py-16 bg-gray-800 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-gray-400">
                No weapons found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    search: "",
                    weaponTypeId: "",
                    rarityId: "",
                    sortBy: "name",
                    sortOrder: "asc",
                  });
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 rounded-md mr-2 bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 rounded-md ${
                        pagination.currentPage === i + 1
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 rounded-md ml-2 bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeaponList;
