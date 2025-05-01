import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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

export const PerustiedotForm = ({
  formData,
  setFormData,
  validationErrors,
}) => {
  const { t } = useTranslation();

  // Initialize all possible fields in formData
  const initialDetailsState = {
    kodinhoitohuone: false,
    arkieteinen: false,
    terassi: false,
    autokatos: false,
    autotalli: false,
  };

  const [showDetails, setShowDetails] = useState(initialDetailsState);

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      kodinhoitohuone: formData.kodinhoitohuone === t("form.options.yes"),
      arkieteinen: formData.arkieteinen === t("form.options.yes"),
      terassi: formData.terassi === t("form.options.yes"),
      autokatos: formData.autokatos === t("form.options.yes"),
      autotalli: formData.autotalli === t("form.options.yes"),
    });
  }, [
    formData.kodinhoitohuone,
    formData.arkieteinen,
    formData.terassi,
    formData.autokatos,
    formData.autotalli,
    t,
  ]);

  // Handle radio button changes
  const handleRadioChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
      // Clear details if "No" is selected
      ...(value === t("form.options.no") && { [`${field}Details`]: "" }),
    });
    setShowDetails((prev) => ({
      ...prev,
      [field]: value === t("form.options.yes"),
    }));
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
      setFormData((prev) => ({ ...prev, budjetti: formattedRange }));
    }

    if (field === "minSize" || field === "maxSize") {
      const min = field === "minSize" ? numValue : formData.minSize;
      const max = field === "maxSize" ? numValue : formData.maxSize;
      const formattedRange = min && max ? `${min} m² - ${max} m²` : "";
      setFormData((prev) => ({ ...prev, talonKoko: formattedRange }));
    }
  };

  // Handle text input changes
  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Field configurations for dynamic rendering
  const radioFields = [
    {
      label: t("form.fields.utilityRoom").split(" ")[0],
      field: "kodinhoitohuone",
    },
    { label: t("form.fields.mudroom"), field: "arkieteinen" },
    { label: t("form.fields.terrace"), field: "terassi" },
  ];

  const garageFields = [
    { label: t("form.fields.carport"), field: "autokatos" },
    { label: t("form.fields.garage"), field: "autotalli" },
  ];

  // Map Finnish details field names to English translation keys for translation
  const detailsFieldTranslationMap = {
    kodinhoitohuoneDetails: "utilityRoomDetails",
    arkieteinenDetails: "mudroomDetails",
    terassiDetails: "terraceDetails",
    autokatosDetails: "carportDetails",
    autotalliDetails: "garageDetails",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t("form.steps.basicInfo")}
      </h2>

      {/* City (Required) */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.city")} *
          {validationErrors.kaupunki && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.kaupunki}
            </span>
          )}
        </label>
        <select
          className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.kaupunki ? "border-red-500" : ""
          }`}
          value={formData.kaupunki || ""}
          onChange={(e) => handleTextInput("kaupunki", e.target.value)}
          required
        >
          <option value="">{t("form.options.selectCity")}</option>
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
          {t("form.fields.province")} *
          {validationErrors.maakunta && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.maakunta}
            </span>
          )}
        </label>
        <select
          className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.maakunta ? "border-red-500" : ""
          }`}
          value={formData.maakunta || ""}
          onChange={(e) => handleTextInput("maakunta", e.target.value)}
          required
        >
          <option value="">{t("form.options.selectProvince")}</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.budget")}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min €"
            className="w-1/2 p-3 border rounded-lg"
            value={formData.minBudget ?? ""}
            onChange={(e) => handleNumberInput("minBudget", e.target.value)}
            min="0"
            step={1000}
          />
          <input
            type="number"
            placeholder="Max €"
            className="w-1/2 p-3 border rounded-lg"
            value={formData.maxBudget ?? ""}
            onChange={(e) => handleNumberInput("maxBudget", e.target.value)}
            min={formData.minBudget || "0"}
            step={1000}
          />
        </div>
      </div>

      {/* House Size */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.houseSize")}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min m²"
            className="w-1/2 p-3 border rounded-lg"
            value={formData.minSize ?? ""}
            onChange={(e) => handleNumberInput("minSize", e.target.value)}
            min="0"
            step={5}
          />
          <input
            type="number"
            placeholder="Max m²"
            className="w-1/2 p-3 border rounded-lg"
            value={formData.maxSize ?? ""}
            onChange={(e) => handleNumberInput("maxSize", e.target.value)}
            min={formData.minSize || "0"}
            step={5}
          />
        </div>
      </div>

      {/* Number of Bedrooms */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.bedrooms")} *
          {validationErrors.bedrooms && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.bedrooms}
            </span>
          )}
        </label>
        <select
          className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.bedrooms ? "border-red-500" : ""
          }`}
          value={formData.bedrooms || ""}
          onChange={(e) => handleTextInput("bedrooms", e.target.value)}
          required
        >
          <option value="">{t("form.options.selectAmount")}</option>
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
            {label} *
            {validationErrors[field] && (
              <span className="text-red-500 text-sm ml-2">
                {validationErrors[field]}
              </span>
            )}
          </label>
          <div className="flex gap-4 mt-2">
            {[t("form.options.yes"), t("form.options.no")].map((option) => (
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
              placeholder={t(
                `form.fields.${detailsFieldTranslationMap[`${field}Details`]}`
              )}
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
            {label} *
            {validationErrors[field] && (
              <span className="text-red-500 text-sm ml-2">
                {validationErrors[field]}
              </span>
            )}
          </label>
          <div className="flex gap-4 mt-2">
            {[t("form.options.yes"), t("form.options.no")].map((option) => (
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
                placeholder={t(
                  `form.fields.${detailsFieldTranslationMap[`${field}Details`]}`
                )}
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
