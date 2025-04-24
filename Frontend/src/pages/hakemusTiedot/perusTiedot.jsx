import React, { useState } from "react";

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
    
    // Update the individual min/max values
    setFormData({ ...formData, [field]: numValue });
    
    // Update the formatted range fields
    if (field === "minBudget" || field === "maxBudget") {
      const min = field === "minBudget" ? numValue : formData.minBudget;
      const max = field === "maxBudget" ? numValue : formData.maxBudget;
      const formattedRange = min && max ? `${min} € - ${max} €` : "";
      setFormData(prev => ({ ...prev, budjetti: formattedRange }));
    }
    
    if (field === "minSize" || field === "maxSize") {
      const min = field === "minSize" ? numValue : formData.minSize;
      const max = field === "maxSize" ? numValue : formData.maxSize;
      const formattedRange = min && max ? `${min} m² - ${max} m²` : "";
      setFormData(prev => ({ ...prev, talonKoko: formattedRange }));
    }
  };

  // Handle text input changes
  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Field configurations for dynamic rendering
  const radioFields = [
    { label: "Kodinhoitohuone *", field: "kodinhoitohuone" },
    { label: "Arkieteinen *", field: "arkieteinen" },
    { label: "Terassi *", field: "terassi" },
  ];

  const garageFields = [
    { label: "Autokatos *", field: "autokatos" },
    { label: "Autotalli *", field: "autotalli" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        Perustiedot
      </h2>

      {/* City (Required) */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          Kaupunki *
          {!formData.kaupunki && (
            <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
          )}
        </label>
        <select
          className="w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
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

      {/* Province (Required) */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          Maakunta *
          {!formData.maakunta && (
            <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
          )}
        </label>
        <select
          className="w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
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

      {/* Budget Range */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Budjetti (€)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-3 border rounded-lg"
            value={formData.minBudget ?? ""}
            onChange={(e) => handleNumberInput("minBudget", e.target.value)}
            min="0"
            step="10000"
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-3 border rounded-lg"
            value={formData.maxBudget ?? ""}
            onChange={(e) => handleNumberInput("maxBudget", e.target.value)}
            min={formData.minBudget || "0"}
            step="10000"
          />
        </div>
      </div>

      {/* House Size Range */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Talon Koko (m²)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-3 border rounded-lg"
            value={formData.minSize ?? ""}
            onChange={(e) => handleNumberInput("minSize", e.target.value)}
            min="0"
            step="5"
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-3 border rounded-lg"
            value={formData.maxSize ?? ""}
            onChange={(e) => handleNumberInput("maxSize", e.target.value)}
            min={formData.minSize || "0"}
            step="5"
          />
        </div>
      </div>

      {/* Bedrooms (Required) */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          Makuuhuoneiden määrä *
          {!formData.bedrooms && (
            <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
          )}
        </label>
        <select
          className="w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
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

      {/* Dynamic Radio Fields */}
      {radioFields.map(({ label, field }) => (
        <div key={field}>
          <label className="block text-lg font-medium text-gray-700">
            {label}
            {!formData[field] && (
              <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
            )}
          </label>
          <div className="flex gap-4 mt-2">
            {["Kyllä", "Ei"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field}
                  value={option}
                  checked={formData[field] === option}
                  onChange={(e) => handleRadioChange(field, e.target.value)}
                  className="accent-blue-500"
                  required
                />
                {option}
              </label>
            ))}
          </div>
          {showDetails[field] && (
            <input
              type="text"
              className="w-full mt-2 p-3 border rounded-lg"
              placeholder={`${label} - Lisätietoja`}
              value={formData[`${field}Details`] || ""}
              onChange={(e) => 
                handleTextInput(`${field}Details`, e.target.value)
              }
            />
          )}
        </div>
      ))}

      {/* Garage Options */}
      {garageFields.map(({ label, field }) => (
        <div key={field}>
          <label className="block text-lg font-medium text-gray-700">
            {label}
            {!formData[field] && (
              <span className="text-red-500 text-sm ml-2">Pakollinen kenttä</span>
            )}
          </label>
          <div className="flex gap-4 mt-2">
            {["Kyllä", "Ei"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field}
                  value={option}
                  checked={formData[field] === option}
                  onChange={(e) => handleRadioChange(field, e.target.value)}
                  className="accent-blue-500"
                  required
                />
                {option}
              </label>
            ))}
          </div>
          {showDetails[field] && (
            <>
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  placeholder="Min koko (m²)"
                  className="w-1/2 p-3 border rounded-lg"
                  value={formData[`${field}Min`] ?? ""}
                  onChange={(e) => 
                    handleNumberInput(`${field}Min`, e.target.value)
                  }
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max koko (m²)"
                  className="w-1/2 p-3 border rounded-lg"
                  value={formData[`${field}Max`] ?? ""}
                  onChange={(e) => 
                    handleNumberInput(`${field}Max`, e.target.value)
                  }
                  min={formData[`${field}Min`] || "0"}
                />
              </div>
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg"
                placeholder={`${label} - Lisätietoja`}
                value={formData[`${field}Details`] || ""}
                onChange={(e) => 
                  handleTextInput(`${field}Details`, e.target.value)
                }
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};