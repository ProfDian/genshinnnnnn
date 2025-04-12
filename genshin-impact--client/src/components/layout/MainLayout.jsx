// src/components/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import Loader from "../common/Loader";

const MainLayout = () => {
  const { initialized } = useContext(AuthContext);

  // Show loader while initializing authentication
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
