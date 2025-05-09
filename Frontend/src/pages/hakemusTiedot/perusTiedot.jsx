import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/languageContext";
import { OptionRender } from "../../components/optionRender";

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
  //console.log("These are the validationErrors: ", validationErrors)
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [houseTypeOptions, setHouseTypeOptions] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);

  useEffect(() => {
    //console.log("Here");
    const houseTypes = t("form.options.houseTypes", { returnObjects: true });
    const deliveryOptions = t("form.options.delivery", { returnObjects: true });
    //console.log("These are the deliveryOptions:", deliveryOptions);
    if (houseTypes) {
      setHouseTypeOptions(Object.keys(houseTypes));
      setDeliveryOptions(Object.keys(deliveryOptions));
    }
  }, [currentLanguage, t]);

  // Initialize all possible fields in formData
  const initialDetailsState = {
    utilityRoom: false,
    mudroom: false,
    terrace: false,
    carport: false,
    garage: false,
  };

  const [showDetails, setShowDetails] = useState(initialDetailsState);

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      utilityRoom: formData.utilityRoom === t("form.options.yes"),
      mudroom: formData.mudroom === t("form.options.yes"),
      terrace: formData.terrace === t("form.options.yes"),
      carport: formData.carport === t("form.options.yes"),
      garage: formData.garage === t("form.options.yes"),
    });
  }, [
    formData.utilityRoom,
    formData.mudroom,
    formData.terrace,
    formData.carport,
    formData.garage,
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

    // Create a new form data object with the updated field
    const newFormData = {
      ...formData,
      [field]: numValue,
    };

    // Update the formatted range fields
    if (field === "minBudget" || field === "maxBudget") {
      const min = field === "minBudget" ? numValue : newFormData.minBudget;
      const max = field === "maxBudget" ? numValue : newFormData.maxBudget;

      if (min !== "" && max !== "") {
        newFormData.budget = `${min} € - ${max} €`;
      }
    }

    if (field === "minSize" || field === "maxSize") {
      const min = field === "minSize" ? numValue : newFormData.minSize;
      const max = field === "maxSize" ? numValue : newFormData.maxSize;

      if (min !== "" && max !== "") {
        newFormData.houseSize = `${min} m² - ${max} m²`;
      }
    }

    // Update the form data with all changes at once
    setFormData(newFormData);
  };

  // Handle text input changes
  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Field configurations for dynamic rendering
  const radioFields = [
    {
      label: t("form.fields.utilityRoom").split(" ")[0],
      field: "utilityRoom",
    },
    { label: t("form.fields.mudroom"), field: "mudroom" },
    { label: t("form.fields.terrace"), field: "terrace" },
  ];

  const garageFields = [
    { label: t("form.fields.carport"), field: "carport" },
    { label: t("form.fields.garage"), field: "garage" },
  ];

  // Map Finnish details field names to English translation keys for translation
  const detailsFieldTranslationMap = {
    utilityRoomDetails: "utilityRoomDetails",
    mudroomDetails: "mudroomDetails",
    terraceDetails: "terraceDetails",
    carportDetails: "carportDetails",
    garageDetails: "garageDetails",
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
          {validationErrors.city && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.city}
            </span>
          )}
        </label>
        <select
          className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.city ? "border-red-500" : ""
          }`}
          value={formData.city || ""}
          onChange={(e) => handleTextInput("city", e.target.value)}
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
          {validationErrors.province && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.province}
            </span>
          )}
        </label>
        <select
          className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.province ? "border-red-500" : ""
          }`}
          value={formData.province || ""}
          onChange={(e) => handleTextInput("province", e.target.value)}
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

      <OptionRender
        field={"houseType"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />


      <OptionRender
        field={"delivery"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />


    
      {/* Floors */}

      {/* Budget (Required) */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.budget")} *
          {validationErrors.budget && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.budget}
            </span>
          )}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min €"
            className={`w-1/2 p-3 border rounded-lg ${
              validationErrors.budget ? "border-red-500" : ""
            }`}
            value={formData.minBudget ?? ""}
            onChange={(e) => handleNumberInput("minBudget", e.target.value)}
            min="0"
            step={1000}
            required
          />
          <input
            type="number"
            placeholder="Max €"
            className={`w-1/2 p-3 border rounded-lg ${
              validationErrors.budget ? "border-red-500" : ""
            }`}
            value={formData.maxBudget ?? ""}
            onChange={(e) => handleNumberInput("maxBudget", e.target.value)}
            min={formData.minBudget || "0"}
            step={1000}
            required
          />
        </div>
      </div>

      {/* House Size (Required) */}
      <div>
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.houseSize")} *
          {validationErrors.houseSize && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.houseSize}
            </span>
          )}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min m²"
            className={`w-1/2 p-3 border rounded-lg ${
              validationErrors.houseSize ? "border-red-500" : ""
            }`}
            value={formData.minSize ?? ""}
            onChange={(e) => handleNumberInput("minSize", e.target.value)}
            min="0"
            step={5}
            required
          />
          <input
            type="number"
            placeholder="Max m²"
            className={`w-1/2 p-3 border rounded-lg ${
              validationErrors.houseSize ? "border-red-500" : ""
            }`}
            value={formData.maxSize ?? ""}
            onChange={(e) => handleNumberInput("maxSize", e.target.value)}
            min={formData.minSize || "0"}
            step={5}
            required
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
                  placeholder={t("form.options.minSize")}
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
