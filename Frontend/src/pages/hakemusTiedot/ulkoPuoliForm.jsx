import React, { useState } from "react";

export const UlkopuoliForm = ({ formData, setFormData }) => {
  const [showCustomMaterial, setShowCustomMaterial] = useState(false);
  const [showCustomRoof, setShowCustomRoof] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">Ulkopuoli</h2>

      {/* Talon Materiaali */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Talon Materiaali *</label>
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white"
          onChange={(e) => {
            const value = e.target.value;
            setShowCustomMaterial(value === "Muu, mikä?");
            setFormData({ ...formData, talonMateriaali: value });
          }}
        >
          <option value="">Valitse materiaali</option>
          {["Puu", "Hirsi", "CLT", "Betoni/Kivi", "Muu, mikä?"].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {showCustomMaterial && (
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border mt-3"
            placeholder="Syötä materiaali"
            onChange={(e) => setFormData({ ...formData, talonMateriaaliMuu: e.target.value })}
          />
        )}
      </div>

      {/* Vesikatto */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Vesikatto *</label>
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white"
          onChange={(e) => {
            const value = e.target.value;
            setShowCustomRoof(value === "Muu, mikä?");
            setFormData({ ...formData, vesikatto: value });
          }}
        >
          <option value="">Valitse vesikatto</option>
          {["Pelti/Saumakatto", "Tiili", "Huopa", "Muu, mikä?"].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {showCustomRoof && (
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border mt-3"
            placeholder="Syötä vesikatto"
            onChange={(e) => setFormData({ ...formData, vesikattoMuu: e.target.value })}
          />
        )}
      </div>
    </div>
  );
};
