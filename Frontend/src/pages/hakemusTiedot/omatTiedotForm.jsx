import React from "react";

export const OmatTiedotForm = ({ formData, setFormData, validationErrors }) => {
  const handleOlenChange = (e) => {
    const selectedOptions = e.target.checked
      ? [...(formData.olen || []), e.target.value]
      : formData.olen.filter((item) => item !== e.target.value);
    setFormData({ ...formData, olen: selectedOptions });
  };

  const handleTextChange = (e) => {
    setFormData({ ...formData, vapaamuotoisiaLisatietoja: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        Omat Tiedot
      </h2>

      {/* Olen Checkbox */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          Olen *
          {validationErrors.olen && (
            <span className="text-red-500 text-sm ml-2">{validationErrors.olen}</span>
          )}
        </label>
        <div className="space-y-3 mt-2">
          {[
            "Harkitsemassa talopakettia (ei vielä rahoitusta)",
            "Etsimässä sopivaa talopakettia",
            "Kilpailuttamassa talopakettia (minulla on rahoitus)",
          ].map((option) => (
            <div key={option} className="flex items-center gap-3">
              <input
                type="checkbox"
                value={option}
                checked={formData.olen?.includes(option)}
                onChange={handleOlenChange}
                className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-md text-gray-700">{option}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Vapaamuotoisia lisätietoja */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          Vapaamuotoisia lisätietoja
        </label>
        <textarea
          placeholder="Kirjoita lisätietoja..."
          className="w-full mt-2 p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          onChange={handleTextChange}
          value={formData.vapaamuotoisiaLisatietoja || ""}
          rows="4"
        />
      </div>
    </div>
  );
};
