import React from "react";

const Footer = () => (
  <footer className="fixed bottom-0 left-0 w-full bg-gray-900 text-white py-20 px-4 flex items-center 
                    justify-between shadow-lg z-50">
    <span className="font-semibold">© {new Date().getFullYear()} talopakettiin.fi</span>
    <span className="text-sm opacity-70">Suunniteltu Suomessa • <a href="mailto:info@talopakettiin.fi" className="underline hover:text-blue-400">Ota yhteyttä</a></span>
  </footer>
);

export default Footer; 