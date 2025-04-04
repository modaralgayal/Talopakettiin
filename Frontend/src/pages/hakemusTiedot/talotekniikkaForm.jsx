import React, { useState } from "react";

export const TalotekniikkaForm = ({ formData, setFormData }) => {
  const handleMinuaKiinnostaaChange = (e) => {
    const { value, checked } = e.target;
    let updatedMinuaKiinnostaa = [...(formData.minuaKiinnostaa || [])];
    if (checked) {
      updatedMinuaKiinnostaa.push(value);
    } else {
      updatedMinuaKiinnostaa = updatedMinuaKiinnostaa.filter((item) => item !== value);
    }
    setFormData({ ...formData, minuaKiinnostaa: updatedMinuaKiinnostaa });
  };

  const handleHaluanTarjousChange = (e) => {
    const { value, checked } = e.target;
    let updatedHaluanTarjous = [...(formData.haluanTarjous || [])];
    if (checked) {
      updatedHaluanTarjous.push(value);
    } else {
      updatedHaluanTarjous = updatedHaluanTarjous.filter((item) => item !== value);
    }
    setFormData({ ...formData, haluanTarjous: updatedHaluanTarjous });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">Talotekniikka</h2>

      {/* Minua Kiinnostaa (Checkboxes) */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Minua kiinnostaa</label>
        <div className="space-y-3">
          {[
            "Taloautomaatio",
            "Aurinkosähkö",
            "Sähköautonlatausasema",
            "Vartijajärjestelmä",
            "Muu",
          ].map((option) => (
            <div key={option} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id={`kiinnostaa-${option}`}
                  name="minuaKiinnostaa"
                  value={option}
                  checked={formData.minuaKiinnostaa.includes(option)}
                  onChange={handleMinuaKiinnostaaChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={`kiinnostaa-${option}`} className="font-medium text-gray-700">
                  {option}
                </label>
              </div>
            </div>
          ))}
        </div>
        {formData.minuaKiinnostaa.includes("Muu") && (
          <input
            type="text"
            placeholder="Muu - mikä?"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border mt-3"
            onChange={(e) =>
              setFormData({ ...formData, muuMinuaKiinnostaa: e.target.value })
            }
          />
        )}
      </div>

      {/* Haluan että tarjoukseen sisältyy (Checkboxes) */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Haluan, että tarjoukseen sisältyy</label>
        <div className="space-y-3">
          {[
            "LVI-työt",
            "Sähkötyöt",
            "Muu",
          ].map((option) => (
            <div key={option} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id={`tarjous-${option}`}
                  name="haluanTarjous"
                  value={option}
                  checked={formData.haluanTarjous.includes(option)}
                  onChange={handleHaluanTarjousChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={`tarjous-${option}`} className="font-medium text-gray-700">
                  {option}
                </label>
              </div>
            </div>
          ))}
        </div>
        {formData.haluanTarjous.includes("Muu") && (
          <input
            type="text"
            placeholder="Muu - mikä?"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border mt-3"
            onChange={(e) =>
              setFormData({ ...formData, muuHaluanTarjous: e.target.value })
            }
          />
        )}
      </div>
    </div>
  );
};
