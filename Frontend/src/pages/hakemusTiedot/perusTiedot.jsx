import React, { useState } from "react";
import { FaMapMarkerAlt, FaHome, FaBed, FaCar, FaInfoCircle } from "react-icons/fa";

const finnishCities = [
  "Helsinki",
  "Espoo",
  "Tampere",
  "Vantaa",
  "Oulu",
  "Turku",
  "Jyväskylä",
  "Lahti",
  "Kuopio",
  "Pori",
];

const provinces = [
  "Uusimaa",
  "Pirkanmaa",
  "Varsinais-Suomi",
  "Pohjois-Pohjanmaa",
  "Keski-Suomi",
  "Satakunta",
];

export const PerustiedotForm = ({ formData, setFormData }) => {
  // Initialize all possible fields in formData
  const initialDetailsState = {
    kodinhoitohuone: false,
    arkieteinen: false,
    terassi: false,
    autokatos: false,
    autotalli: false,
  };
  
  const [showDetails, setShowDetails] = useState(initialDetailsState);

  // Handle radio button changes
  const handleRadioChange = (field, value) => {
    setFormData({ 
      ...formData, 
      [field]: value,
      // Clear details if "Ei" is selected
      ...(value === "Ei" && { [`${field}Details`]: "" })
    });
    setShowDetails(prev => ({ ...prev, [field]: value === "Kyllä" }));
  };

  // Handle number inputs with validation
  const handleNumberInput = (field, value) => {
    const numValue = value === "" ? "" : Number(value);
    setFormData({ ...formData, [field]: numValue });
  };

  // Handle text input changes
  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Field configurations for dynamic rendering
  const radioFields = [
    { label: "Kodinhoitohuone", field: "kodinhoitohuone", icon: <FaHome className="w-5 h-5" /> },
    { label: "Arkieteinen", field: "arkieteinen", icon: <FaHome className="w-5 h-5" /> },
    { label: "Terassi", field: "terassi", icon: <FaHome className="w-5 h-5" /> },
  ];

  const garageFields = [
    { label: "Autokatos", field: "autokatos", icon: <FaCar className="w-5 h-5" /> },
    { label: "Autotalli", field: "autotalli", icon: <FaCar className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Perustiedot</h2>
      </div>

      {/* Location Information */}
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Kaupunki *
            {!formData.kaupunki && (
              <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
            )}
          </label>
          <select
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            value={formData.kaupunki || ""}
            onChange={(e) => handleTextInput("kaupunki", e.target.value)}
            required
          >
            <option value="">Valitse kaupunki</option>
            {finnishCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Maakunta *
            {!formData.maakunta && (
              <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
            )}
          </label>
          <select
            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            value={formData.maakunta || ""}
            onChange={(e) => handleTextInput("maakunta", e.target.value)}
            required
          >
            <option value="">Valitse maakunta</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Budget and Size */}
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Budjetti (€) *
            {(!formData.minBudjetti || !formData.maxBudjetti) && (
              <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
            )}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="number"
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pl-8"
                value={formData.minBudjetti || ""}
                onChange={(e) => handleNumberInput("minBudjetti", e.target.value)}
                placeholder="Minimi budjetti"
                step="1000"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            </div>
            <div className="relative">
              <input
                type="number"
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pl-8"
                value={formData.maxBudjetti || ""}
                onChange={(e) => handleNumberInput("maxBudjetti", e.target.value)}
                placeholder="Maksimi budjetti"
                step="1000"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Määritä budjettisi minimi- ja maksimiarvot
          </p>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Talon koko (m²) *
            {(!formData.minTalonKoko || !formData.maxTalonKoko) && (
              <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
            )}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="number"
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pl-8"
                value={formData.minTalonKoko || ""}
                onChange={(e) => handleNumberInput("minTalonKoko", e.target.value)}
                placeholder="Minimi koko"
                step="5"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">m²</span>
            </div>
            <div className="relative">
              <input
                type="number"
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pl-8"
                value={formData.maxTalonKoko || ""}
                onChange={(e) => handleNumberInput("maxTalonKoko", e.target.value)}
                placeholder="Maksimi koko"
                step="5"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">m²</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Määritä talon koko minimi- ja maksimiarvoina
          </p>
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Makuuhuoneiden määrä *
          {!formData.bedrooms && (
            <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
          )}
        </label>
        <select
          className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          value={formData.bedrooms || ""}
          onChange={(e) => handleTextInput("bedrooms", e.target.value)}
          required
        >
          <option value="">Valitse määrä</option>
          {[1, 2, 3, 4, 5, 6, 7, "8+"].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Additional Features */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
          <FaInfoCircle className="w-5 h-5 text-blue-600" />
          Lisäominaisuudet
        </h3>

        <div className="space-y-6">
          {radioFields.map(({ label, field, icon }) => (
            <div key={field} className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                {icon}
                {label} *
                {!formData[field] && (
                  <span className="text-red-500 text-sm">Pakollinen kenttä</span>
                )}
              </label>
              <div className="flex gap-4">
                {["Kyllä", "Ei"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={field}
                      value={option}
                      checked={formData[field] === option}
                      onChange={(e) => handleRadioChange(field, e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                      required
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {showDetails[field] && (
                <input
                  type="text"
                  className="w-full mt-3 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={`${label} - Lisätietoja`}
                  value={formData[`${field}Details`] || ""}
                  onChange={(e) => handleTextInput(`${field}Details`, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Garage Options */}
        <div className="space-y-6">
          {garageFields.map(({ label, field, icon }) => (
            <div key={field} className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                {icon}
                {label} *
                {!formData[field] && (
                  <span className="text-red-500 text-sm">Pakollinen kenttä</span>
                )}
              </label>
              <div className="flex gap-4">
                {["Kyllä", "Ei"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={field}
                      value={option}
                      checked={formData[field] === option}
                      onChange={(e) => handleRadioChange(field, e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                      required
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {showDetails[field] && (
                <input
                  type="text"
                  className="w-full mt-3 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={`${label} - Lisätietoja`}
                  value={formData[`${field}Details`] || ""}
                  onChange={(e) => handleTextInput(`${field}Details`, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};