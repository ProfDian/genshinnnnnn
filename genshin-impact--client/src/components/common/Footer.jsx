// src/components/common/Footer.jsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">
                Genshin Impact DB
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              A comprehensive database for Genshin Impact, featuring detailed
              information on characters, weapons, regions, and more.
            </p>
            <p className="text-gray-500 text-xs">
              This is a fan-made project. Genshin Impact and all related content
              are property of miHoYo/HoYoverse.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/characters"
                  className="text-gray-400 hover:text-indigo-400 text-sm"
                >
                  Characters
                </Link>
              </li>
              <li>
                <Link
                  to="/weapons"
                  className="text-gray-400 hover:text-indigo-400 text-sm"
                >
                  Weapons
                </Link>
              </li>
              <li>
                <Link
                  to="/regions"
                  className="text-gray-400 hover:text-indigo-400 text-sm"
                >
                  Regions
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-400 hover:text-indigo-400 text-sm"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-medium mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-indigo-400 text-sm"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-indigo-400 text-sm"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-400 hover:text-indigo-400 text-sm"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="text-gray-400 hover:text-indigo-400 text-sm"
                >
                  Favorites
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Genshin Impact Database. All
            rights reserved.
          </p>

          {/* Social media icons would go here */}
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
