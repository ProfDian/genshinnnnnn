// src/pages/user/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI, userAPI } from "../../services/api";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaImage,
  FaKey,
  FaArrowLeft,
  FaHeart,
} from "react-icons/fa";

export default function Profile() {
  const { userInfo, getCurrentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: userInfo?.name || "",
    bio: userInfo?.bio || "",
    profileImage: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [imagePreview, setImagePreview] = useState(
    userInfo?.profileImage || null
  );
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const data = await userAPI.getFavorites();
      console.log(data);
      setFavorites(data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        profileImage: file,
      });

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("bio", profileData.bio);

      if (profileData.profileImage) {
        formData.append("profileImage", profileData.profileImage);
      }

      await authAPI.updateProfile(formData);
      await getCurrentUser(); // Refresh user info

      setSuccess("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      setLoading(false);
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      await userAPI.removeFromFavorites(favoriteId);
      fetchFavorites(); // Refresh list
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="btn btn-secondary flex items-center gap-2"
            >
              <FaArrowLeft /> Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">{userInfo?.username}</div>
            <button onClick={() => logout()} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "profile"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Information
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "password"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("password")}
              >
                Change Password
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "favorites"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("favorites")}
              >
                My Favorites
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Success/Error Messages */}
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 w-32 h-32 relative">
                        {imagePreview || userInfo?.profileImage ? (
                          <img
                            src={imagePreview || userInfo?.profileImage}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaUser className="text-gray-400 text-4xl" />
                          </div>
                        )}
                        <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-gray-100">
                          <FaImage className="text-gray-600" />
                          <input
                            type="file"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Click the icon to change your profile picture
                      </p>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Account Information
                      </h3>
                      <div className="flex items-center mb-2">
                        <FaUser className="text-gray-400 mr-2" />
                        <span className="text-gray-700">
                          {userInfo?.username}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        <span className="text-gray-700">{userInfo?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="text-gray-400" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="form-input pl-10"
                          placeholder="Your full name"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="bio" className="form-label">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio || ""}
                        onChange={handleProfileChange}
                        className="form-input"
                        placeholder="Tell us about yourself"
                        rows="5"
                        disabled={loading}
                      ></textarea>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit}>
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaKey className="text-gray-400" />
                      </div>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="form-input pl-10"
                        placeholder="Your current password"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaKey className="text-gray-400" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="form-input pl-10"
                        placeholder="Your new password"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaKey className="text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="form-input pl-10"
                        placeholder="Confirm new password"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  My Favorite Characters
                </h3>

                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <FaHeart className="mx-auto text-gray-300 text-5xl mb-4" />
                    <p className="text-gray-500">
                      You haven't added any favorites yet
                    </p>
                    <button
                      onClick={() => navigate("/user/dashboard")}
                      className="mt-4 btn btn-primary"
                    >
                      Browse Characters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((favorite) => (
                      <div
                        key={favorite.favoriteId}
                        className="border rounded-lg p-4 flex items-center"
                      >
                        <div className="flex-shrink-0 mr-4">
                          {favorite.itemIcon ? (
                            <img
                              src={favorite.itemIcon}
                              alt={favorite.itemName}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-lg font-medium text-gray-900">
                            {favorite.itemName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {favorite.favoriteType}
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => removeFavorite(favorite.favoriteId)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove from favorites"
                          >
                            <FaHeart />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
