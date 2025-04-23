import React from "react";
import { NavLink } from "react-router-dom";
import blackLogo from "./talopakettiinlogovariants-black.png";

export const CustomerHeader = ({ handleLogout }) => {
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
                { name: "Hakemus", path: "/formpage" },
                { name: "Omat hakemukset", path: "/viewmyapplications" },
                { name: "Omat tarjoukset", path: "/viewmyoffers" },
              ].map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `text-gray-700 hover:text-blue-600 text-lg font-medium transition-colors
                      ${isActive ? "text-blue-600" : ""}`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Logout button */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Kirjaudu ulos
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
