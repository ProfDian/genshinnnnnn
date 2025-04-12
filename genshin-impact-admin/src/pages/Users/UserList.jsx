import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiSearch, FiUserCheck, FiUserX } from "react-icons/fi";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import userService from "../../services/userService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminModal, setAdminModal] = useState({
    isOpen: false,
    userId: null,
    username: "",
    isAdmin: false,
  });

  // Filtered users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Open admin confirmation modal
  const openAdminModal = (user) => {
    setAdminModal({
      isOpen: true,
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  };

  // Close admin confirmation modal
  const closeAdminModal = () => {
    setAdminModal({
      isOpen: false,
      userId: null,
      username: "",
      isAdmin: false,
    });
  };

  // Handle admin status toggle
  const handleToggleAdmin = async () => {
    try {
      const response = await userService.toggleAdminStatus(adminModal.userId);

      // Update user in the list
      setUsers(
        users.map((user) =>
          user.id === adminModal.userId
            ? { ...user, isAdmin: response.user.isAdmin }
            : user
        )
      );

      toast.success(response.message);
      closeAdminModal();
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast.error("Failed to update admin status");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Table columns
  const columns = [
    {
      key: "id",
      title: "ID",
      width: "60px",
    },
    {
      key: "username",
      title: "Username",
      sortable: true,
      render: (user) => (
        <div>
          <div className="font-medium">{user.username}</div>
          {user.name && (
            <div className="text-xs text-gray-500">{user.name}</div>
          )}
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      sortable: true,
    },
    {
      key: "isAdmin",
      title: "Role",
      width: "120px",
      render: (user) => (
        <div>
          {user.isAdmin ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary">
              Admin
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              User
            </span>
          )}
        </div>
      ),
    },
    {
      key: "favorites",
      title: "Favorites",
      width: "100px",
      render: (user) => (
        <div className="text-center">{user._count?.favorites || 0}</div>
      ),
    },
    {
      key: "lastLogin",
      title: "Last Login",
      sortable: true,
      render: (user) => (
        <div className="text-sm text-gray-600">
          {formatDate(user.lastLogin)}
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Created At",
      sortable: true,
      render: (user) => (
        <div className="text-sm text-gray-600">
          {formatDate(user.createdAt)}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: "100px",
      render: (user) => (
        <div className="flex justify-center">
          <button
            onClick={() => openAdminModal(user)}
            className={`p-2 rounded-full ${
              user.isAdmin
                ? "text-primary hover:bg-primary-light"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title={user.isAdmin ? "Remove admin rights" : "Grant admin rights"}
          >
            {user.isAdmin ? <FiUserX size={18} /> : <FiUserCheck size={18} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout title="Users">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-gray-600">
          Manage all users and their administrative privileges
        </p>
      </div>

      <div className="card mb-6">
        <div className="mb-4 flex justify-between items-center">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="form-input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table columns={columns} data={filteredUsers} isLoading={loading} />
      </div>

      <ConfirmModal
        isOpen={adminModal.isOpen}
        onClose={closeAdminModal}
        onConfirm={handleToggleAdmin}
        title={
          adminModal.isAdmin ? "Remove Admin Rights" : "Grant Admin Rights"
        }
        message={
          adminModal.isAdmin
            ? `Are you sure you want to remove admin rights from "${adminModal.username}"?`
            : `Are you sure you want to grant admin rights to "${adminModal.username}"?`
        }
        confirmText={adminModal.isAdmin ? "Remove" : "Grant"}
        type={adminModal.isAdmin ? "warning" : "info"}
      />
    </Layout>
  );
};

export default UserList;
