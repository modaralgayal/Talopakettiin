import React from "react";
import { NavLink } from "react-router-dom";
import blackLogo from "./talopakettiinlogovariants-black.png";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and main navigation */}
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <NavLink to="/" className="flex-shrink-0">
              <img
                src={blackLogo}
                alt="Talopakettiin Logo"
                className="w-32 h-auto object-contain hover:opacity-80 transition-opacity"
              />
            </NavLink>

            {/* Main Navigation */}
            <ul className="hidden md:flex space-x-8">
              {[
                { name: "Etusivu", path: "/" },
                { name: "Tietoa meistä", path: "/about" },
                { name: "Yhteystiedot", path: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `text-gray-700 hover:text-blue-600 text-lg font-medium transition-colors relative pb-2
                      ${isActive ? "text-blue-600" : ""}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.name}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-blue-600 transform transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`}></div>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Sign in and Provider options */}
          <div className="flex items-center space-x-6">
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 text-lg font-medium transition-colors relative pb-2
                ${isActive ? "text-blue-600" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  Kirjaudu
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-blue-600 transform transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`}></div>
                </>
              )}
            </NavLink>
            <NavLink
              to="/formpage"
              className={({ isActive }) =>
                `inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full text-white transition-colors
                ${isActive ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"}`
              }
            >
              Täytä hakemus
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};
