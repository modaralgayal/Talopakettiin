import React from "react";
import { NavLink } from "react-router-dom";

export const Header = () => {
  console.log("This is the Normal Header");

  return (
<header className="bg-gray-600 py-4 shadow-md">
  <nav className="max-w-7xl mx-auto px-6 flex justify-center items-center">
    {/* Container to center both Logo and Nav */}
    <div className="flex items-center space-x-12">
      {/* 🚀 Logo */}
      <div className="w-32 h-12 bg-gray-400 flex items-center justify-center rounded-md text-white font-bold">
        LOGO
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-8">
        {[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Contact Us", path: "/contact" },
          { name: "Sign In", path: "/customersignin" },
          { name: "For Providers", path: "/providersignin" },
          { name: "Form page", path: "/formpage" },
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
    </div>
  </nav>
</header>

  );
};
