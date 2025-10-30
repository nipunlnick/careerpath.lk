import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { LogoIcon } from "./icons";

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-green-600"
            >
              <img src="/cplogo.png" alt="CareerPath.lk" className="h-10 w-7" />
              <span>
                CareerPath
                <span className="text-gray-800 dark:text-gray-200">.lk</span>
              </span>
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {currentUser ? (
                <>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                        isActive
                          ? "bg-green-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white"
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white transition-colors duration-300"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="ml-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-300"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-100 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-green-500 ml-2"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          {currentUser ? (
            <>
              <NavLink
                to="/profile"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white"
                  }`
                }
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                onClick={closeMenu}
                className="block mt-1 bg-green-600 text-white px-3 py-2 rounded-md text-base font-medium text-center hover:bg-green-700 transition-colors duration-300"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
