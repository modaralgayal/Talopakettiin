import React from "react";
import { NavLink } from "react-router-dom";
import blackLogo from "./talopakettiinlogovariants-black.png";

export const CustomerHeader = ({ handleLogout }) => {
  console.log("This is the Customer Header");

  return (
    <header className="bg-gray-600 py-4 shadow-md">
      <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* 🚀 Logo Placeholder */}
        <NavLink to="/">
          <img
            src={blackLogo}
            alt="Logo"
            className="w-32 h-auto object-contain hover:opacity-80 transition-opacity"
          />
        </NavLink>

        {/* Navigation Links */}
        <ul className="flex space-x-8">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Contact Us", path: "/contact" },
            { name: "Form page", path: "/formpage" },
            { name: "View My Applications", path: "/viewmyapplications" },
            { name: "View My Offers", path: "/viewmyoffers" },
          ].map((item) => (
            <li key={item.name} className="group">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-white text-xl transition-colors py-2 px-2 block rounded-2xl 
                  group-hover:underline underline-offset-8 ${
                    isActive ? "underline underline-offset-8" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};
