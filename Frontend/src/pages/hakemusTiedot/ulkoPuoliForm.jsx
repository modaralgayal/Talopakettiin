import React, { useState, useEffect } from "react";

export const UlkopuoliForm = ({ formData, setFormData }) => {
  const [showCustomMaterial, setShowCustomMaterial] = useState(false);
  const [showCustomRoof, setShowCustomRoof] = useState(false);

  useEffect(() => {
    setShowCustomMaterial(formData.talonMateriaali === "Muu, mikä?");
    setShowCustomRoof(formData.vesikatto === "Muu, mikä?");
  }, [formData.talonMateriaali, formData.vesikatto]);

  const handleSelectChange = (field, value) => {
    const update = { ...formData, [field]: value };

    if (field === "talonMateriaali") {
      setShowCustomMaterial(value === "Muu, mikä?");
      if (value !== "Muu, mikä?") {
        update.talonMateriaaliMuu = "";
      }
    }

    if (field === "vesikatto") {
      setShowCustomRoof(value === "Muu, mikä?");
      if (value !== "Muu, mikä?") {
        update.vesikattoMuu = "";
      }
    }

    setFormData(update);
  };

  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">Ulkopuoli</h2>

      {/* Talon Materiaali */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Talon Materiaali *</label>
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white"
          value={formData.talonMateriaali || ""}
          onChange={(e) => handleSelectChange("talonMateriaali", e.target.value)}
        >
          <option value="">Valitse materiaali</option>
          {["Puu", "Hirsi", "CLT", "Betoni/Kivi", "Muu, mikä?"].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {showCustomMaterial && (
          <input
            type="text"
            placeholder="Syötä materiaali"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border mt-3"
            value={formData.talonMateriaaliMuu || ""}
            onChange={(e) => handleTextInput("talonMateriaaliMuu", e.target.value)}
          />
        )}
      </div>

      {/* Vesikatto */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Vesikatto *</label>
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white"
          value={formData.vesikatto || ""}
          onChange={(e) => handleSelectChange("vesikatto", e.target.value)}
        >
          <option value="">Valitse vesikatto</option>
          {["Pelti/Saumakatto", "Tiili", "Huopa", "Muu, mikä?"].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {showCustomRoof && (
          <input
            type="text"
            placeholder="Syötä vesikatto"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border mt-3"
            value={formData.vesikattoMuu || ""}
            onChange={(e) => handleTextInput("vesikattoMuu", e.target.value)}
          />
        )}
      </div>
    </div>
  );
};
