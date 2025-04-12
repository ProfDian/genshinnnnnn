import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import characterService from "../../services/characterService";

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
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    characterId: null,
    characterName: "",
  });

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
      console.log(data.characters);
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
      // In a real application, you would have API endpoints for these
      // For now, let's simulate with mock data
      setElements([
        { id: 1, elementName: "Pyro", elementColor: "#f44336" },
        { id: 2, elementName: "Hydro", elementColor: "#2196f3" },
        { id: 3, elementName: "Anemo", elementColor: "#4caf50" },
        { id: 4, elementName: "Electro", elementColor: "#9c27b0" },
        { id: 5, elementName: "Dendro", elementColor: "#8bc34a" },
        { id: 6, elementName: "Cryo", elementColor: "#00bcd4" },
        { id: 7, elementName: "Geo", elementColor: "#ff9800" },
      ]);

      setWeaponTypes([
        { id: 1, weaponTypeName: "Sword" },
        { id: 2, weaponTypeName: "Claymore" },
        { id: 3, weaponTypeName: "Polearm" },
        { id: 4, weaponTypeName: "Catalyst" },
        { id: 5, weaponTypeName: "Bow" },
      ]);

      setRegions([
        { id: 1, regionName: "Mondstadt" },
        { id: 2, regionName: "Liyue" },
        { id: 3, regionName: "Inazuma" },
        { id: 4, regionName: "Sumeru" },
        { id: 5, regionName: "Fontaine" },
        { id: 6, regionName: "Natlan" },
      ]);

      setRarities([
        { id: 1, rarityValue: 1, rarityColor: "#a256e1" },
        { id: 2, rarityValue: 2, rarityColor: "#bd6932" },
        { id: 3, rarityValue: 3, rarityColor: "#5f8ee6" },
        { id: 4, rarityValue: 4, rarityColor: "#5d9953" },
        { id: 5, rarityValue: 5, rarityColor: "#6e7179" },
      ]);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCharacters();
    fetchFilterOptions();
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

  // Open delete confirmation modal
  const openDeleteModal = (character) => {
    setDeleteModal({
      isOpen: true,
      characterId: character.id,
      characterName: character.name,
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      characterId: null,
      characterName: "",
    });
  };

  // Handle character deletion
  const handleDeleteCharacter = async () => {
    try {
      await characterService.deleteCharacter(deleteModal.characterId);
      toast.success(
        `Character ${deleteModal.characterName} deleted successfully`
      );
      fetchCharacters(pagination.currentPage); // Refresh the list
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting character:", error);
      toast.error("Failed to delete character");
    }
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
          {character.icon && (
            <img
              src={character.icon}
              alt={character.name}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
          )}
          <div>
            <div className="font-medium">{character.name}</div>
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
              className="inline-block px-2 py-1 rounded text-xs text-white"
              style={{ backgroundColor: character.element.elementColor }}
            >
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
        <div>{character.weaponType?.weaponTypeName || "-"}</div>
      ),
    },
    {
      key: "rarity",
      title: "Rarity",
      render: (character) => (
        <div>
          {character.rarity ? (
            <div className="flex">
              {[...Array(character.rarity.rarityValue)].map((_, index) => (
                <span key={index} className="text-yellow-500">
                  ★
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: "region",
      title: "Region",
      render: (character) => <div>{character.region?.regionName || "-"}</div>,
    },
    {
      key: "actions",
      title: "Actions",
      width: "150px",
      render: (character) => (
        <div className="flex space-x-2">
          <Link
            to={`/characters/${character.id}`}
            className="p-1 text-gray-600 hover:text-primary"
            title="View"
          >
            <FiEye size={18} />
          </Link>
          <Link
            to={`/characters/edit/${character.id}`}
            className="p-1 text-gray-600 hover:text-primary"
            title="Edit"
          >
            <FiEdit size={18} />
          </Link>
          <button
            onClick={() => openDeleteModal(character)}
            className="p-1 text-gray-600 hover:text-error"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout title="Characters">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Character Management</h1>
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

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="relative flex-grow max-w-md mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or title..."
              className="form-input pl-10 w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center"
          >
            <FiFilter className="mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded mb-4">
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
              <button onClick={resetFilters} className="btn btn-outline">
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

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCharacter}
        title="Delete Character"
        message={`Are you sure you want to delete "${deleteModal.characterName}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </Layout>
  );
};

export default CharacterList;
