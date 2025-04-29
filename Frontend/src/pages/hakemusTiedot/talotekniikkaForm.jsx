import React, { useState, useEffect } from "react";

export const TalotekniikkaForm = ({ formData, setFormData }) => {
  const [showDetails, setShowDetails] = useState({
    minuaKiinnostaa: false,
    haluanTarjous: false
  });

  const optionsMinuaKiinnostaa = [
    "Taloautomaatio",
    "Aurinkosähkö",
    "Sähköautonlatausasema",
    "Vartijajärjestelmä",
    "Muu",
  ];

  const optionsHaluanTarjous = [
    "LVI-työt",
    "Sähkötyöt",
    "Muu",
  ];

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      minuaKiinnostaa: (formData.minuaKiinnostaa || []).includes("Muu"),
      haluanTarjous: (formData.haluanTarjous || []).includes("Muu")
    });
  }, [formData.minuaKiinnostaa, formData.haluanTarjous]);

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setFormData({ ...formData, [field]: updatedValues });

    if (field === "minuaKiinnostaa") {
      setShowDetails(prev => ({ ...prev, minuaKiinnostaa: updatedValues.includes("Muu") }));
      if (!updatedValues.includes("Muu")) {
        setFormData(prev => ({ ...prev, muuMinuaKiinnostaa: "" }));
      }
    }

    if (field === "haluanTarjous") {
      setShowDetails(prev => ({ ...prev, haluanTarjous: updatedValues.includes("Muu") }));
      if (!updatedValues.includes("Muu")) {
        setFormData(prev => ({ ...prev, muuHaluanTarjous: "" }));
      }
    }
  };

  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">Talotekniikka</h2>

      {/* Minua Kiinnostaa */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Minua kiinnostaa</label>
        <div className="space-y-3">
          {optionsMinuaKiinnostaa.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={option}
                checked={(formData.minuaKiinnostaa || []).includes(option)}
                onChange={() => handleCheckboxChange("minuaKiinnostaa", option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              {option}
            </label>
          ))}
        </div>
        {showDetails.minuaKiinnostaa && (
          <input
            type="text"
            placeholder="Muu - mikä?"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border mt-3"
            value={formData.muuMinuaKiinnostaa || ""}
            onChange={(e) => handleTextInput("muuMinuaKiinnostaa", e.target.value)}
          />
        )}
      </div>

      {/* Haluan että tarjoukseen sisältyy */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Haluan, että tarjoukseen sisältyy</label>
        <div className="space-y-3">
          {optionsHaluanTarjous.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={option}
                checked={(formData.haluanTarjous || []).includes(option)}
                onChange={() => handleCheckboxChange("haluanTarjous", option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              {option}
            </label>
          ))}
        </div>
        {showDetails.haluanTarjous && (
          <input
            type="text"
            placeholder="Muu - mikä?"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border mt-3"
            value={formData.muuHaluanTarjous || ""}
            onChange={(e) => handleTextInput("muuHaluanTarjous", e.target.value)}
          />
        )}
      </div>
    </div>
  );
};
