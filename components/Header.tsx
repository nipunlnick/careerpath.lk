"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../constants/navigation";

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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-md py-2"
          : "bg-transparent py-4 border-b border-transparent"
      } dark:glass-dark`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src="/cplogo.png"
                  alt="CareerPath.lk"
                  className="h-10 w-7 relative z-10"
                />
              </div>
              <span>
                CareerPath
                <span className="text-primary">.lk</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800/50 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full glass dark:glass-dark shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen
            ? "translate-y-0 opacity-100 visible"
            : "-translate-y-2 opacity-0 invisible"
        }`}
        id="mobile-menu"
      >
        <div className="px-4 py-6 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                isActive(link.path)
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
