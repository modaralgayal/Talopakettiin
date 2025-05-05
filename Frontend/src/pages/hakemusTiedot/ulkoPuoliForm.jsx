import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const UlkopuoliForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState({
    houseMaterial: false,
    roof: false,
  });

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      houseMaterial: formData.houseMaterial === t("form.options.otherWhat"),
      roof: formData.roof === t("form.options.otherWhat"),
    });
  }, [formData.houseMaterial, formData.roof, t]);

  const handleSelectChange = (field, value) => {
    const update = { ...formData, [field]: value };

    if (field === "houseMaterial") {
      setShowDetails((prev) => ({
        ...prev,
        houseMaterial: value === t("form.options.otherWhat"),
      }));
      if (value !== t("form.options.otherWhat")) {
        update.houseMaterialOther = "";
      }
    }

    if (field === "roof") {
      setShowDetails((prev) => ({
        ...prev,
        roof: value === t("form.options.otherWhat"),
      }));
      if (value !== t("form.options.otherWhat")) {
        update.roofOther = "";
      }
    }

    setFormData(update);
  };

  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Map Finnish details field names to English translation keys for translation
  const detailsFieldTranslationMap = {
    houseMaterialOther: "houseMaterialOther",
    roofOther: "roofOther",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t("form.steps.exterior")}
      </h2>

      {/* Talon Materiaali */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.houseMaterial")} *
          {validationErrors.houseMaterial && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.houseMaterial}
            </span>
          )}
        </label>
        <select
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white ${
            validationErrors.houseMaterial ? "border-red-500" : ""
          }`}
          value={formData.houseMaterial || ""}
          onChange={(e) =>
            handleSelectChange("houseMaterial", e.target.value)
          }
        >
          <option value="">{t("form.options.selectMaterial")}</option>
          {[
            t("form.options.wood"),
            t("form.options.timber"),
            t("form.options.CLT"),
            t("form.options.concrete"),
            t("form.options.noPreference"),
            t("form.options.otherWhat"),
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {showDetails.houseMaterial && (
          <input
            type="text"
            placeholder={t(
              `form.fields.${detailsFieldTranslationMap["houseMaterialOther"]}`
            )}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border mt-3"
            value={formData.houseMaterialOther || ""}
            onChange={(e) =>
              handleTextInput("houseMaterialOther", e.target.value)
            }
          />
        )}
      </div>

      {/* Vesikatto */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.roof")} *
          {validationErrors.roof && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.roof}
            </span>
          )}
        </label>
        <select
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white ${
            validationErrors.roof ? "border-red-500" : ""
          }`}
          value={formData.roof || ""}
          onChange={(e) => handleSelectChange("roof", e.target.value)}
        >
          <option value="">{t("form.options.selectRoof")}</option>
          {[
            t("form.options.metalRoof"),
            t("form.options.brick"),
            t("form.options.felt"),
            t("form.options.noPreference"),
            t("form.options.otherWhat"),
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {showDetails.roof && (
          <input
            type="text"
            placeholder={t(
              `form.fields.${detailsFieldTranslationMap["roofOther"]}`
            )}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border mt-3"
            value={formData.roofOther || ""}
            onChange={(e) => handleTextInput("roofOther", e.target.value)}
          />
        )}
      </div>
    </div>
  );
};
