import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiTool,
  FiMap,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <FiHome className="mr-3 text-lg" />,
      path: "/dashboard",
    },
    {
      label: "Karakter",
      icon: <FiUsers className="mr-3 text-lg" />,
      path: "/characters",
      submenu: [
        { label: "Daftar Karakter", path: "/characters" },
        { label: "Tambah Karakter", path: "/characters/create" },
      ],
    },
    {
      label: "Senjata",
      icon: <FiTool className="mr-3 text-lg" />,
      path: "/weapons",
      submenu: [
        { label: "Daftar Senjata", path: "/weapons" },
        { label: "Tambah Senjata", path: "/weapons/create" },
      ],
    },
    {
      label: "Region",
      icon: <FiMap className="mr-3 text-lg" />,
      path: "/regions",
      submenu: [
        { label: "Daftar Region", path: "/regions" },
        { label: "Tambah Region", path: "/regions/create" },
      ],
    },
    {
      label: "Pengguna",
      icon: <FiBook className="mr-3 text-lg" />,
      path: "/users",
    },
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-30 w-full bg-surface shadow-md p-4 flex justify-between items-center">
        <h1 className="text-primary font-bold">Genshin Impact Admin</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-700 p-2"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-surface shadow-lg transform transition-transform duration-300 ease-in-out
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Genshin Impact</h1>
          <p className="text-gray-600 text-sm">Admin Panel</p>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || user?.username?.charAt(0) || "A"}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user?.name || user?.username}</p>
              <p className="text-gray-600 text-xs">Admin</p>
            </div>
          </div>
        </div>

        <nav className="mt-4 px-4">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-2">
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center justify-between p-2 rounded hover:bg-gray-100 transition-colors
                        ${
                          isActive(item.path)
                            ? "bg-primary-light text-primary font-medium"
                            : "text-gray-700"
                        }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        {item.label}
                      </div>
                      {expandedMenus[item.label] ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                    {expandedMenus[item.label] && (
                      <ul className="ml-6 mt-2 space-y-1">
                        {item.submenu.map((subitem, subindex) => (
                          <li key={subindex}>
                            <Link
                              to={subitem.path}
                              className={`block p-2 rounded hover:bg-gray-100 transition-colors
                                ${
                                  location.pathname === subitem.path
                                    ? "text-primary font-medium"
                                    : "text-gray-700"
                                }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subitem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded hover:bg-gray-100 transition-colors
                      ${
                        isActive(item.path)
                          ? "bg-primary-light text-primary font-medium"
                          : "text-gray-700"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="mt-6">
              <button
                onClick={logout}
                className="flex items-center p-2 w-full rounded hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <FiLogOut className="mr-3 text-lg" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
