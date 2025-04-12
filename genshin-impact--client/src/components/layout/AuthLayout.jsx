// src/components/layout/AuthLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Loader from "../common/Loader";

const AuthLayout = () => {
  const { user, loading } = useContext(AuthContext);

  // Show loader while checking authentication
  if (loading) {
    return <Loader />;
  }

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 bg-[url('/src/assets/images/genshin-bg.jpg')] bg-cover bg-center">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
