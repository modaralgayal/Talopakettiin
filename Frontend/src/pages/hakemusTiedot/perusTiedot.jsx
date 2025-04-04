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
  const [showDetails, setShowDetails] = useState({
    kodinhoitohuone: false,
    arkieteinen: false,
    terassi: false,
    autokatos: false,
    autotalli: false,
  });

  const handleRadioChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setShowDetails((prev) => ({ ...prev, [field]: value === "Kyllä" }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        Perustiedot
      </h2>

      {/* City */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Kaupunki *</label>
        <select
          className="w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) =>
            setFormData({ ...formData, kaupunki: e.target.value })
          }
        >
          <option value="">Valitse kaupunki</option>
          {finnishCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Province */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Maakunta *</label>
        <select
          className="w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) =>
            setFormData({ ...formData, maakunta: e.target.value })
          }
        >
          <option value="">Valitse maakunta</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Budjetti (€)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-3 border rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, minBudget: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-3 border rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, maxBudget: e.target.value })
            }
          />
        </div>
      </div>

      {/* House Size */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Talon Koko (m²)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 p-3 border rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, minSize: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 p-3 border rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, maxSize: e.target.value })
            }
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Makuuhuoneiden määrä *</label>
        <select
          className="w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) =>
            setFormData({ ...formData, bedrooms: e.target.value })
          }
        >
          {[1, 2, 3, 4, 5, 6, 7, "8+"].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Fields with Radio Buttons */}
      {[
        { label: "Kodinhoitohuone *", field: "kodinhoitohuone" },
        { label: "Arkieteinen *", field: "arkieteinen" },
        { label: "Terassi *", field: "terassi" },
      ].map(({ label, field }) => (
        <div key={field}>
          <label className="block text-lg font-medium text-gray-700">{label}</label>
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
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [`${field}Details`]: e.target.value,
                })
              }
            />
          )}
        </div>
      ))}

      {/* Garage Options */}
      {[
        { label: "Autokatos *", field: "autokatos" },
        { label: "Autotalli *", field: "autotalli" },
      ].map(({ label, field }) => (
        <div key={field}>
          <label className="block text-lg font-medium text-gray-700">{label}</label>
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
                  placeholder="Min size"
                  className="w-1/2 p-3 border rounded-lg"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`${field}Min`]: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Max size"
                  className="w-1/2 p-3 border rounded-lg"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [`${field}Max`]: e.target.value,
                    })
                  }
                />
              </div>
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg"
                placeholder={`${label} - Lisätietoja`}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`${field}Details`]: e.target.value,
                  })
                }
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};
