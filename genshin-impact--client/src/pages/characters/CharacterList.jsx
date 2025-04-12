import { useState, useEffect } from "react";
import api from "../../services/api";
import CharacterCard from "../../components/cards/CharacterCard";
import SearchBar from "../../components/common/SearchBar";
import FilterGroup from "../../components/common/FilterGroup";
import Loader from "../../components/common/Loader";

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [elements, setElements] = useState([]);
  const [weaponTypes, setWeaponTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    elementId: "",
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
    // Fetch elements and weapon types for filters
    const fetchFilterOptions = async () => {
      try {
        const [elementsRes, weaponTypesRes] = await Promise.all([
          api.get("/elements"),
          api.get("/weapon-types"),
        ]);

        setElements(
          elementsRes.data.map((el) => ({
            value: el.id,
            label: el.elementName,
            color: el.elementColor,
            icon: el.elementIcon,
          }))
        );

        setWeaponTypes(
          weaponTypesRes.data.map((wt) => ({
            value: wt.id,
            label: wt.weaponTypeName,
            icon: wt.weaponTypeIcon,
          }))
        );
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    // Fetch characters with current filters and pagination
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          ...filters,
          page: pagination.currentPage,
          limit: 20,
        };

        const response = await api.get("/characters", { params });
        console.log(response.data.characters);
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
      <h1 className="text-3xl font-bold text-white mb-8">Characters</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <FilterGroup
          title="Elements"
          options={elements}
          selectedValue={filters.elementId}
          onChange={(value) => handleFilterChange("elementId", value)}
        />

        <FilterGroup
          title="Weapon Types"
          options={weaponTypes}
          selectedValue={filters.weaponTypeId}
          onChange={(value) => handleFilterChange("weaponTypeId", value)}
        />

        <FilterGroup
          title="Rarity"
          options={[
            { value: "5", label: "⭐⭐⭐⭐⭐", color: "#BD6932" },
            { value: "4", label: "⭐⭐⭐⭐", color: "#A256E1" },
          ]}
          selectedValue={filters.rarityId}
          onChange={(value) => handleFilterChange("rarityId", value)}
        />
      </div>

      {/* Loading state */}
      {loading && <Loader />}

      {/* Error state */}
      {error && (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Character Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>

          {/* No results */}
          {characters.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400">
                No characters found. Try different filters.
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 rounded-md mr-2 bg-gray-700 text-white disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-gray-400 mx-2">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 rounded-md ml-2 bg-gray-700 text-white disabled:opacity-50"
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

export default CharacterList;
