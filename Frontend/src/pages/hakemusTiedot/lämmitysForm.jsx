import React, { useState } from "react";

export const LämmitysForm = ({ formData, setFormData }) => {
  const [showTakkaDetails, setShowTakkaDetails] = useState(false);
  const [showLeivinuuniDetails, setShowLeivinuuniDetails] = useState(false);

  const handleLämmitysmuotoChange = (e) => {
    const { value, checked } = e.target;
    let updatedLämmitysmuoto = [...(formData.lämmitysmuoto || [])];
    if (checked) {
      updatedLämmitysmuoto.push(value);
    } else {
      updatedLämmitysmuoto = updatedLämmitysmuoto.filter((item) => item !== value);
    }
    setFormData({ ...formData, lämmitysmuoto: updatedLämmitysmuoto });
  };

  const handleTakkaChange = (e) => {
    setShowTakkaDetails(e.target.value === "Kyllä");
    setFormData({ ...formData, takka: e.target.value });
  };

  const handleLeivinuuniChange = (e) => {
    setShowLeivinuuniDetails(e.target.value === "Kyllä");
    setFormData({ ...formData, leivinuuni: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">Lämmitys</h2>

      {/* Lämmitysmuoto (Checkboxes for Multiple Choices) */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">Lämmitysmuoto *</label>
        <div className="space-y-3">
          {[
            "Sähkö",
            "Ilma-vesilämpöpumppu",
            "Maalämpöpumppu",
            "Kaukolämpö",
            "Puu, pelletti tai hake",
            "Öljylämmitys",
            "Ilmalämpöpumppu",
            "Lämmöntalteenotto",
            "Muu",
          ].map((option) => (
            <div key={option} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id={`lämmitys-${option}`}
                  name="lämmitysmuoto"
                  value={option}
                  checked={formData.lämmitysmuoto.includes(option)}
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
        {formData.lämmitysmuoto.includes("Muu") && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Muu - mikä?"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
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
        <div className="flex space-x-6">
          {["Kyllä", "Ei", "En tiedä vielä"].map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`takka-${option}`}
                name="takka"
                value={option}
                checked={formData.takka === option}
                onChange={handleTakkaChange}
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
            <div className="flex space-x-6">
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
        <div className="flex space-x-6">
          {["Kyllä", "Ei", "En tiedä vielä"].map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`leivinuuni-${option}`}
                name="leivinuuni"
                value={option}
                checked={formData.leivinuuni === option}
                onChange={handleLeivinuuniChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor={`leivinuuni-${option}`} className="ml-2 block text-sm font-medium text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Muu Tieto */}
      <div className="space-y-2">
        <label className="block text-lg font-medium text-gray-700">Muu tieto</label>
        <div className="mt-1">
          <input
            type="text"
            placeholder="Lisää muu tieto"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
            onChange={(e) =>
              setFormData({ ...formData, muuTieto: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};