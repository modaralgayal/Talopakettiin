import React, { useState } from "react";

export const SisapuoliForm = ({ formData, setFormData }) => {
  const initialDetailsState = {
    lattia: false,
    valiseinat: false,
    sisakatto: false,
  };

  const [showDetails, setShowDetails] = useState(initialDetailsState);

  const dropdownFields = [
    {
      label: "Lattia *",
      field: "lattia",
      options: ["Parketti", "Laminaatti", "Vinyyli", "Korkki", "Laatta", "Muu"],
      placeholder: "Syötä lattiamateriaali",
    },
    {
      label: "Väliseinät *",
      field: "valiseinat",
      options: ["Kipsilevy", "Kevytbetoni", "Muu"],
      placeholder: "Syötä väliseinämateriaali",
    },
    {
      label: "Sisäkatto *",
      field: "sisakatto",
      options: ["Puupaneeli", "Kipsilevy", "Vinyyli", "Muu"],
      placeholder: "Syötä sisäkaton materiaali",
    },
  ];

  const handleDropdownChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
      ...(value !== "Muu" && { [`${field}Details`]: "" }),
    });
    setShowDetails((prev) => ({ ...prev, [field]: value === "Muu" }));
  };

  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">Sisäpuoli</h2>

      {dropdownFields.map(({ label, field, options, placeholder }) => (
        <div key={field}>
          <label className="block text-lg font-medium text-gray-700">
            {label}
            {!formData[field] && (
              <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
            )}
          </label>
          <select
            className="w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            value={formData[field] || ""}
            onChange={(e) => handleDropdownChange(field, e.target.value)}
            required
          >
            <option value="">Valitse vaihtoehto</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {showDetails[field] && (
            <input
              type="text"
              placeholder={placeholder}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border mt-3"
              value={formData[`${field}Details`] || ""}
              onChange={(e) =>
                handleTextInput(`${field}Details`, e.target.value)
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};
