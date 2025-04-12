// src/pages/characters/CharacterList.jsx
import { useState, useEffect } from "react";
import { characterService } from "../../services"; // Import service
import CharacterCard from "../../components/cards/CharacterCard";
import SearchBar from "../../components/common/SearchBar";
import FilterGroup from "../../components/common/FilterGroup";
import Loader from "../../components/common/Loader";

const CharacterList = () => {
  // State for characters data
  const [characters, setCharacters] = useState([]);

  // State for filter options
  const [elements, setElements] = useState([]);
  const [weaponTypes, setWeaponTypes] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    elementId: "",
    weaponTypeId: "",
    rarityId: "",
    sortBy: "name",
    sortOrder: "asc",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Fetch filter options (elements and weapon types) on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // These could be moved to separate services if needed
        const elementsResponse = await characterService.getElements();
        const weaponTypesResponse = await characterService.getWeaponTypes();

        // Format element options for filter component
        setElements(
          elementsResponse.data.map((el) => ({
            value: el.id,
            label: el.elementName,
            color: el.elementColor,
            icon: el.elementIcon,
          }))
        );

        // Format weapon type options for filter component
        setWeaponTypes(
          weaponTypesResponse.data.map((wt) => ({
            value: wt.id,
            label: wt.weaponTypeName,
            icon: wt.weaponTypeIcon,
          }))
        );
      } catch (err) {
        console.error("Error fetching filter options:", err);
        // We don't set main error state here to still allow characters to load
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch characters with current filters and pagination
  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        // Prepare parameters for the API request
        const params = {
          ...filters,
          page: pagination.currentPage,
          limit: 20,
        };

        // Use the characterService to fetch characters
        const response = await characterService.getAllCharacters(params);
        console.log(response.data);

        // Update state with API response
        setCharacters(response.data.characters);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Error fetching characters:", err);
        setError("Failed to load characters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [filters, pagination.currentPage]); // Re-fetch when filters or page changes

  // Handler for search input
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

  // Handler for filter changes (element, weapon type, rarity)
  const handleFilterChange = (filterName, value) => {
    // Toggle filter if clicking the same value (for filter reset functionality)
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

  // Handler for pagination
  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPage: newPage,
    });

    // Scroll to top on page change for better UX
    window.scrollTo(0, 0);
  };

  // Handler for sorting change
  const handleSortChange = (sortOption) => {
    const [sortBy, sortOrder] = sortOption.split(":");

    setFilters({
      ...filters,
      sortBy,
      sortOrder,
    });

    // Reset to first page when changing sort
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Characters</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search characters by name..."
        />
      </div>

      {/* Filters Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-medium">Filters</h2>

          {/* Clear all filters button */}
          {(filters.elementId ||
            filters.weaponTypeId ||
            filters.rarityId ||
            filters.search) && (
            <button
              onClick={() => {
                setFilters({
                  search: "",
                  elementId: "",
                  weaponTypeId: "",
                  rarityId: "",
                  sortBy: "name",
                  sortOrder: "asc",
                });
                setPagination({
                  ...pagination,
                  currentPage: 1,
                });
              }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Filter Groups */}
        <div className="flex flex-wrap gap-4">
          {/* Element Filter */}
          <FilterGroup
            title="Elements"
            options={elements}
            selectedValue={filters.elementId}
            onChange={(value) => handleFilterChange("elementId", value)}
          />

          {/* Weapon Type Filter */}
          <FilterGroup
            title="Weapon Types"
            options={weaponTypes}
            selectedValue={filters.weaponTypeId}
            onChange={(value) => handleFilterChange("weaponTypeId", value)}
          />

          {/* Rarity Filter */}
          <FilterGroup
            title="Rarity"
            options={[
              { value: "5", label: "⭐⭐⭐⭐⭐", color: "#BD6932" },
              { value: "4", label: "⭐⭐⭐⭐", color: "#A256E1" },
            ]}
            selectedValue={filters.rarityId}
            onChange={(value) => handleFilterChange("rarityId", value)}
          />

          {/* Sort Options */}
          <div className="flex-grow md:flex-grow-0">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Sort By
            </label>
            <select
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
              <option value="releaseDate:desc">Newest First</option>
              <option value="releaseDate:asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Indicators */}
      {(filters.elementId ||
        filters.weaponTypeId ||
        filters.rarityId ||
        filters.search) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.search && (
            <div className="bg-indigo-900 bg-opacity-50 text-white rounded-full px-3 py-1 text-sm flex items-center">
              <span>Search: {filters.search}</span>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    search: "",
                  });
                }}
                className="ml-2 text-indigo-300 hover:text-white"
              >
                ×
              </button>
            </div>
          )}

          {filters.elementId && (
            <div className="bg-indigo-900 bg-opacity-50 text-white rounded-full px-3 py-1 text-sm flex items-center">
              <span>
                Element:{" "}
                {elements.find((e) => e.value === parseInt(filters.elementId))
                  ?.label || "Unknown"}
              </span>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    elementId: "",
                  });
                }}
                className="ml-2 text-indigo-300 hover:text-white"
              >
                ×
              </button>
            </div>
          )}

          {filters.weaponTypeId && (
            <div className="bg-indigo-900 bg-opacity-50 text-white rounded-full px-3 py-1 text-sm flex items-center">
              <span>
                Weapon:{" "}
                {weaponTypes.find(
                  (w) => w.value === parseInt(filters.weaponTypeId)
                )?.label || "Unknown"}
              </span>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    weaponTypeId: "",
                  });
                }}
                className="ml-2 text-indigo-300 hover:text-white"
              >
                ×
              </button>
            </div>
          )}

          {filters.rarityId && (
            <div className="bg-indigo-900 bg-opacity-50 text-white rounded-full px-3 py-1 text-sm flex items-center">
              <span>
                Rarity: {filters.rarityId === "5" ? "⭐⭐⭐⭐⭐" : "⭐⭐⭐⭐"}
              </span>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    rarityId: "",
                  });
                }}
                className="ml-2 text-indigo-300 hover:text-white"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && <Loader />}

      {/* Error state */}
      {error && (
        <div className="text-center py-10 bg-red-900 bg-opacity-20 rounded-lg border border-red-700">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-300 text-lg">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Character Grid */}
      {!loading && !error && (
        <>
          {/* Results info */}
          <div className="text-gray-400 mb-4">
            Showing {characters.length} of {pagination.totalItems} characters
          </div>

          {/* Character Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>

          {/* No results */}
          {characters.length === 0 && !loading && (
            <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
              <svg
                className="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <p className="text-gray-400 text-xl">No characters found</p>
              <p className="text-gray-500 mt-2">Try changing your filters</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center bg-gray-800 p-2 rounded-lg shadow-lg">
                {/* First page button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="px-2 py-1 rounded-md mr-1 bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="First page"
                >
                  ««
                </button>

                {/* Previous page button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 rounded-md mr-2 bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  «
                </button>

                {/* Page indicator */}
                <span className="px-4 py-1 rounded-md bg-indigo-700 text-white font-medium">
                  {pagination.currentPage}
                </span>

                <span className="text-gray-400 mx-2">
                  of {pagination.totalPages}
                </span>

                {/* Next page button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 rounded-md ml-2 bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  »
                </button>

                {/* Last page button */}
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-2 py-1 rounded-md ml-1 bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Last page"
                >
                  »»
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CharacterList;
