import React, { useState } from "react";

export const SisapuoliForm = ({ formData, setFormData }) => {
  const [showLattiaDetails, setShowLattiaDetails] = useState(false);
  const [showValiseinatDetails, setShowValiseinatDetails] = useState(false);
  const [showSisakattoDetails, setShowSisakattoDetails] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">Sisäpuoli</h2>

      {/* Lattia Dropdown */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Lattia *</label>
        <select
          className="w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => {
            const value = e.target.value;
            setShowLattiaDetails(value === "Muu");
            setFormData({ ...formData, lattia: value });
          }}
        >
          <option value="">Valitse lattiamateriaali</option>
          {["Parketti", "Laminaatti", "Vinyyli", "Korkki", "Laatta", "Muu"].map(
            (option) => (
              <option key={option} value={option}>
                {option}
              </option>
            )
          )}
        </select>
        {showLattiaDetails && (
          <input
            type="text"
            placeholder="Syötä lattiamateriaali"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border mt-3"
            onChange={(e) =>
              setFormData({ ...formData, lattiaDetails: e.target.value })
            }
          />
        )}
      </div>

      {/* Väliseinät Dropdown */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Väliseinät *</label>
        <select
          className="w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => {
            const value = e.target.value;
            setShowValiseinatDetails(value === "Muu");
            setFormData({ ...formData, valiseinat: value });
          }}
        >
          <option value="">Valitse väliseinämateriaali</option>
          {["Kipsilevy", "Kevytbetoni", "Muu"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {showValiseinatDetails && (
          <input
            type="text"
            placeholder="Syötä väliseinämateriaali"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border mt-3"
            onChange={(e) =>
              setFormData({ ...formData, valiseinatDetails: e.target.value })
            }
          />
        )}
      </div>

      {/* Sisäkatto Dropdown */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Sisäkatto *</label>
        <select
          className="w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => {
            const value = e.target.value;
            setShowSisakattoDetails(value === "Muu");
            setFormData({ ...formData, sisakatto: value });
          }}
        >
          <option value="">Valitse sisäkaton materiaali</option>
          {["Puupaneeli", "Kipsilevy", "Vinyyli", "Muu"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {showSisakattoDetails && (
          <input
            type="text"
            placeholder="Syötä sisäkaton materiaali"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border mt-3"
            onChange={(e) =>
              setFormData({ ...formData, sisakattoDetails: e.target.value })
            }
          />
        )}
      </div>
    </div>
  );
};
