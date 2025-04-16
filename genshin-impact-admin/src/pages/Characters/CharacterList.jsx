import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiPlus, FiEdit, FiEye, FiSearch, FiFilter, FiX } from "react-icons/fi";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import {
  characterService,
  referenceDataService,
  regionService,
} from "../../services";

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    elementId: "",
    weaponTypeId: "",
    regionId: "",
    rarityId: "",
  });
  const [elements, setElements] = useState([]);
  const [weaponTypes, setWeaponTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [rarities, setRarities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch characters
  const fetchCharacters = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: searchTerm || undefined,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      };

      const data = await characterService.getCharacters(params);
      setCharacters(data.characters);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching characters:", error);
      toast.error("Failed to load characters");
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      // Fetch all reference data in parallel
      const [elementsData, weaponTypesData, regionsData, raritiesData] =
        await Promise.all([
          referenceDataService.getAllElements(),
          referenceDataService.getAllWeaponTypes(),
          regionService.getAllRegions(),
          referenceDataService.getAllRarities(),
        ]);

      setElements(elementsData);
      setWeaponTypes(weaponTypesData);
      setRegions(regionsData);
      setRarities(raritiesData);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      toast.error("Failed to load filter options");
    }
  };

  // Initial load
  useEffect(() => {
    Promise.all([fetchCharacters(), fetchFilterOptions()]);
  }, []);

  // Fetch when search or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCharacters(1); // Reset to first page when search/filters change
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  // Handle page change
  const handlePageChange = (page) => {
    fetchCharacters(page);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      elementId: "",
      weaponTypeId: "",
      regionId: "",
      rarityId: "",
    });
    setSearchTerm("");
  };

  // Helper to get element badge styling
  const getElementStyle = (element) => {
    if (!element) return {};

    // Base styles
    const style = {
      background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      border: "1px solid rgba(0,0,0,0.1)",
      backdropFilter: "blur(4px)",
      padding: "4px 8px",
      borderRadius: "4px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    };

    // Add element-specific styles if element has a color
    if (element.elementColor) {
      style.border = `1px solid ${element.elementColor}`;
      style.background = `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`;
      style.boxShadow = `0 2px 6px rgba(0,0,0,0.1), 0 0 0 1px ${element.elementColor}`;
    }

    return style;
  };

  // Helper to get rarity stars with color
  const getRarityStars = (rarity) => {
    if (!rarity) return <span className="text-gray-400">-</span>;

    // Use rarity color if available, fallback to default
    const color = rarity.rarityColor || "#FFD700";

    return (
      <div
        className="flex items-center px-2 py-1 rounded-md"
        style={{
          background: `linear-gradient(to right, ${color}15, ${color}25)`,
          border: `1px solid ${color}50`,
        }}
      >
        {[...Array(rarity.rarityValue)].map((_, index) => (
          <span key={index} style={{ color: color }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Table columns
  const columns = [
    {
      key: "id",
      title: "ID",
      width: "70px",
      sortable: true,
    },
    {
      key: "name",
      title: "Name",
      sortable: true,
      render: (character) => (
        <div className="flex items-center">
          {character.icon ? (
            <div
              className="relative mr-3 rounded-lg overflow-hidden"
              style={{
                padding: "3px",
                background: character.rarity
                  ? `${character.rarity.rarityColor}`
                  : "#cccccc",
                boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
                width: "48px",
                height: "48px",
              }}
            >
              <img
                src={character.icon}
                alt={character.name}
                className="w-full h-full object-cover rounded"
              />
              {/* Element icon indicator in corner */}
              {character.element && character.element.elementIcon && (
                <div className="absolute top-0 right-0 w-4 h-4">
                  <img
                    src={character.element.elementIcon}
                    alt={character.element.elementName}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              className="relative mr-3 rounded-lg overflow-hidden flex items-center justify-center text-white font-bold"
              style={{
                width: "48px",
                height: "48px",
                background: character.rarity
                  ? `${character.rarity.rarityColor}`
                  : "#cccccc",
              }}
            >
              {character.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-medium text-gray-800">{character.name}</div>
            {character.title && (
              <div className="text-xs text-gray-500">{character.title}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "element",
      title: "Element",
      render: (character) => (
        <div>
          {character.element ? (
            <span
              style={getElementStyle(character.element)}
              className="text-sm font-medium text-gray-800"
            >
              {character.element.elementIcon && (
                <img
                  src={character.element.elementIcon}
                  alt={character.element.elementName}
                  className="w-5 h-5"
                />
              )}
              {character.element.elementName}
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: "weaponType",
      title: "Weapon",
      render: (character) => (
        <div>
          {character.weaponType ? (
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-md border border-gray-200">
              {character.weaponType.weaponTypeIcon ? (
                <img
                  src={character.weaponType.weaponTypeIcon}
                  alt={character.weaponType.weaponTypeName}
                  className="w-5 h-5"
                />
              ) : (
                <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                  {character.weaponType.weaponTypeName.charAt(0)}
                </span>
              )}
              <span className="text-sm">
                {character.weaponType.weaponTypeName}
              </span>
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: "rarity",
      title: "Rarity",
      render: (character) => getRarityStars(character.rarity),
    },
    {
      key: "region",
      title: "Region",
      render: (character) => (
        <div>
          {character.region ? (
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-md border border-gray-200">
              {character.region.regionIcon ? (
                <img
                  src={character.region.regionIcon}
                  alt={character.region.regionName}
                  className="w-5 h-5"
                />
              ) : (
                <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                  {character.region.regionName.charAt(0)}
                </span>
              )}
              <span className="text-sm">{character.region.regionName}</span>
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: "120px",
      render: (character) => (
        <div className="flex space-x-2">
          <Link
            to={`/characters/${character.id}`}
            className="p-2 text-gray-600 hover:text-primary bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="View"
          >
            <FiEye size={18} />
          </Link>
          <Link
            to={`/characters/edit/${character.id}`}
            className="p-2 text-gray-600 hover:text-primary bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Edit"
          >
            <FiEdit size={18} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <Layout title="Characters">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold genshin-title">
            Character Management
          </h1>
          <p className="text-gray-600">Manage all Genshin Impact characters</p>
        </div>

        <Link
          to="/characters/create"
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Character
        </Link>
      </div>

      <div className="card mb-6 overflow-hidden border border-gray-200">
        <div className="p-4 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="relative flex-grow max-w-md mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or title..."
                className="form-input pl-10 w-full border-gray-300 focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-50 rounded-md shadow-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${
                showFilters ? "btn-secondary" : "btn-outline"
              } flex items-center`}
            >
              <FiFilter className="mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="elementId" className="form-label">
                    Element
                  </label>
                  <select
                    id="elementId"
                    name="elementId"
                    className="form-input"
                    value={filters.elementId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Elements</option>
                    {elements.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.elementName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="weaponTypeId" className="form-label">
                    Weapon Type
                  </label>
                  <select
                    id="weaponTypeId"
                    name="weaponTypeId"
                    className="form-input"
                    value={filters.weaponTypeId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Weapon Types</option>
                    {weaponTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.weaponTypeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="regionId" className="form-label">
                    Region
                  </label>
                  <select
                    id="regionId"
                    name="regionId"
                    className="form-input"
                    value={filters.regionId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Regions</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.regionName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="rarityId" className="form-label">
                    Rarity
                  </label>
                  <select
                    id="rarityId"
                    name="rarityId"
                    className="form-input"
                    value={filters.rarityId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Rarities</option>
                    {rarities.map((rarity) => (
                      <option key={rarity.id} value={rarity.id}>
                        {rarity.rarityValue} Star
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="btn btn-outline flex items-center"
                >
                  <FiX className="mr-2" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          <Table
            columns={columns}
            data={characters}
            pagination={pagination}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CharacterList;
