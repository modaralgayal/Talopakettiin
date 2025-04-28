import React, { useState } from "react";

export const LämmitysForm = ({ formData, setFormData, validationErrors }) => {
  // Initialize all possible heating options
  const heatingOptions = [
    "Sähkö",
    "Ilma-vesilämpöpumppu",
    "Maalämpöpumppu",
    "Kaukolämpö",
    "Puu, pelletti tai hake",
    "Öljylämmitys",
    "Ilmalämpöpumppu",
    "Lämmöntalteenotto",
    "Muu",
  ];

  // Derived states for showing details
  const showTakkaDetails = formData.takka === "Kyllä";
  const showLeivinuuniDetails = formData.leivinuuni === "Kyllä";
  const showMuuLämmitysDetails = formData.lämmitysmuoto?.includes("Muu");

  // Handle checkbox changes for heating types
  const handleLämmitysmuotoChange = (e) => {
    const { value, checked } = e.target;
    const currentSelection = formData.lämmitysmuoto || [];
    
    const updatedLämmitysmuoto = checked
      ? [...currentSelection, value]
      : currentSelection.filter(item => item !== value);

    setFormData({ 
      ...formData, 
      lämmitysmuoto: updatedLämmitysmuoto,
      // Clear "other" field if "Muu" is unselected
      muuLämmitysmuoto: value === "Muu" && !checked ? "" : formData.muuLämmitysmuoto
    });
  };

  // Handle radio button changes
  const handleRadioChange = (field, value) => {
    setFormData({ 
      ...formData, 
      [field]: value,
      // Clear details if "Ei" is selected
      ...(field === "takka" && value !== "Kyllä" && { varaavuus: "" }),
      ...(field === "leivinuuni" && value !== "Kyllä" && { leivinuuniDetails: "" })
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">Lämmitys</h2>

      {/* Lämmitysmuoto (Multiple Choice) */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          Lämmitysmuoto *
          {validationErrors.lämmitysmuoto && (
            <span className="text-red-500 text-sm ml-2">{validationErrors.lämmitysmuoto}</span>
          )}
        </label>
        <div className="space-y-3">
          {heatingOptions.map((option) => (
            <div key={option} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id={`lämmitys-${option}`}
                  name="lämmitysmuoto"
                  value={option}
                  checked={formData.lämmitysmuoto?.includes(option) || false}
                  onChange={handleLämmitysmuotoChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={`lämmitys-${option}`} className="font-medium text-gray-700">
                  {option}
                </label>
              </div>
            </div>
          ))}
        </div>
        {showMuuLämmitysDetails && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Muu - mikä?"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              value={formData.muuLämmitysmuoto || ""}
              onChange={(e) =>
                setFormData({ ...formData, muuLämmitysmuoto: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Takka/Tulisija */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Takka/Tulisija</label>
        <div className="flex flex-wrap gap-4">
          {["Kyllä", "Ei", "En tiedä vielä"].map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`takka-${option}`}
                name="takka"
                value={option}
                checked={formData.takka === option}
                onChange={(e) => handleRadioChange("takka", e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor={`takka-${option}`} className="ml-2 block text-sm font-medium text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
        {showTakkaDetails && (
          <div className="mt-4 space-y-3 pl-5 border-l-2 border-gray-200">
            <label className="block text-base font-medium text-gray-700">Varaavuus</label>
            <div className="flex flex-wrap gap-4">
              {["Vaara", "Ei varaava"].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    id={`varaavuus-${option}`}
                    name="varaavuus"
                    value={option}
                    checked={formData.varaavuus === option}
                    onChange={(e) =>
                      setFormData({ ...formData, varaavuus: e.target.value })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={`varaavuus-${option}`} className="ml-2 block text-sm font-medium text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leivinuuni */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Leivinuuni</label>
        <div className="flex flex-wrap gap-4">
          {["Kyllä", "Ei", "En tiedä vielä"].map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`leivinuuni-${option}`}
                name="leivinuuni"
                value={option}
                checked={formData.leivinuuni === option}
                onChange={(e) => handleRadioChange("leivinuuni", e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor={`leivinuuni-${option}`} className="ml-2 block text-sm font-medium text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
        {showLeivinuuniDetails && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Leivinuunin lisätiedot"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              value={formData.leivinuuniDetails || ""}
              onChange={(e) =>
                setFormData({ ...formData, leivinuuniDetails: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Muu Tieto */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Muu tieto</label>
        <div className="mt-1">
          <textarea
            placeholder="Lisää muu tieto lämmityksestä"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border min-h-[100px]"
            value={formData.muuTieto || ""}
            onChange={(e) =>
              setFormData({ ...formData, muuTieto: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};