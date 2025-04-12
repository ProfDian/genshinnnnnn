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
import weaponService from "../../services/weaponService";

const WeaponList = () => {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    weaponTypeId: "",
    rarityId: "",
  });
  const [weaponTypes, setWeaponTypes] = useState([]);
  const [rarities, setRarities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    weaponId: null,
    weaponName: "",
  });

  // Fetch weapons
  const fetchWeapons = async (page = 1) => {
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

      const data = await weaponService.getWeapons(params);
      setWeapons(data.weapons);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching weapons:", error);
      toast.error("Failed to load weapons");
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      // Fetch weapon types
      const weaponTypesData = await weaponService.getWeaponTypes();
      setWeaponTypes(weaponTypesData);

      // For rarities, we'll use mock data (you would typically fetch this from an API)
      setRarities([
        { id: 1, rarityValue: 1, rarityColor: "#6e7179" },
        { id: 2, rarityValue: 2, rarityColor: "#5d9953" },
        { id: 3, rarityValue: 3, rarityColor: "#5f8ee6" },
        { id: 4, rarityValue: 4, rarityColor: "#a256e1" },
        { id: 5, rarityValue: 5, rarityColor: "#bd6932" },
      ]);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWeapons();
    fetchFilterOptions();
  }, []);

  // Fetch when search or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWeapons(1); // Reset to first page when search/filters change
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  // Handle page change
  const handlePageChange = (page) => {
    fetchWeapons(page);
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
      weaponTypeId: "",
      rarityId: "",
    });
    setSearchTerm("");
  };

  // Open delete confirmation modal
  const openDeleteModal = (weapon) => {
    setDeleteModal({
      isOpen: true,
      weaponId: weapon.id,
      weaponName: weapon.name,
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      weaponId: null,
      weaponName: "",
    });
  };

  // Handle weapon deletion
  const handleDeleteWeapon = async () => {
    try {
      await weaponService.deleteWeapon(deleteModal.weaponId);
      toast.success(`Weapon ${deleteModal.weaponName} deleted successfully`);
      fetchWeapons(pagination.currentPage); // Refresh the list
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting weapon:", error);
      toast.error("Failed to delete weapon");
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
      render: (weapon) => (
        <div className="flex items-center">
          {weapon.icon && (
            <img
              src={weapon.icon}
              alt={weapon.name}
              className="w-10 h-10 rounded mr-3 object-contain"
            />
          )}
          <div className="font-medium">{weapon.name}</div>
        </div>
      ),
    },
    {
      key: "weaponType",
      title: "Type",
      render: (weapon) => <div>{weapon.weaponType?.weaponTypeName || "-"}</div>,
    },
    {
      key: "rarity",
      title: "Rarity",
      render: (weapon) => (
        <div>
          {weapon.rarity ? (
            <div className="flex">
              {[...Array(weapon.rarity.rarityValue)].map((_, index) => (
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
      key: "specialProperty",
      title: "Substat",
      render: (weapon) => <div>{weapon.specialProperty || "-"}</div>,
    },
    {
      key: "actions",
      title: "Actions",
      width: "150px",
      render: (weapon) => (
        <div className="flex space-x-2">
          <Link
            to={`/weapons/${weapon.id}`}
            className="p-1 text-gray-600 hover:text-primary"
            title="View"
          >
            <FiEye size={18} />
          </Link>
          <Link
            to={`/weapons/edit/${weapon.id}`}
            className="p-1 text-gray-600 hover:text-primary"
            title="Edit"
          >
            <FiEdit size={18} />
          </Link>
          <button
            onClick={() => openDeleteModal(weapon)}
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
    <Layout title="Weapons">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Weapon Management</h1>
          <p className="text-gray-600">Manage all Genshin Impact weapons</p>
        </div>

        <Link
          to="/weapons/create"
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Weapon
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
              placeholder="Search by name..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {type.label || type.weaponTypeName}
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
          data={weapons}
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteWeapon}
        title="Delete Weapon"
        message={`Are you sure you want to delete "${deleteModal.weaponName}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </Layout>
  );
};

export default WeaponList;
