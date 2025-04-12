import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FiBell, FiSearch } from "react-icons/fi";

const Layout = ({ children, title }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen size is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className={`${isMobile ? "pt-16" : ""} lg:ml-64 min-h-screen`}>
        <header className="bg-surface shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{title}</h1>

            <div className="flex items-center">
              <div className="relative mr-4 hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-input pl-10 py-1"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 bg-error w-2 h-2 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>

        <footer className="py-4 px-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          Genshin Impact Admin Panel &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default Layout;
