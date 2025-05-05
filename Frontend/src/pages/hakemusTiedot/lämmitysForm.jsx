import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const LämmitysForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState({
    heatingTypeOther: false,
    fireplace: false,
    bakingOven: false,
    directElectricHeating: false,
  });

  const heatingOptions = [
    t("form.options.airSourceHeatPump"),
    t("form.options.geothermalHeat"),
    t("form.options.electric"),
    t("form.options.waterCirculatedHeating"),
    t("form.options.woodHeating"),
    t("form.options.districtHeating"),
    t("form.options.other"),
  ];

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      heatingTypeOther: (formData.heatingType || []).includes(
        t("form.options.other")
      ),
      fireplace: formData.fireplace === t("form.options.yes"),
      bakingOven: formData.bakingOven === t("form.options.yes"),
      directElectricHeating: (formData.heatingType || []).includes(t("form.options.waterCirculatedHeating")),
    });
  }, [formData.heatingType, formData.fireplace, formData.bakingOven, t]);

  const handleHeatingTypeChange = (e) => {
    const value = e.target.value;
    const currentValues = formData.heatingType || [];
    let newValues;

    if (e.target.checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((item) => item !== value);
    }

    setFormData({
      ...formData,
      heatingType: newValues,
      ...(value === t("form.options.other") &&
        !e.target.checked && { heatingTypeOther: "" }),
    });

    setShowDetails((prev) => ({
      ...prev,
      heatingTypeOther: newValues.includes(t("form.options.other")),
    }));
  };

  const handleRadioChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
      ...(field === "fireplace" &&
        value !== t("form.options.yes") && { fireplaceHeatStorage: "" }),
      ...(field === "bakingOven" &&
        value !== t("form.options.yes") && { bakingOvenDetails: "" }),
    });

    setShowDetails((prev) => ({
      ...prev,
      [field]: value === t("form.options.yes"),
    }));
  };

  // **in lämmitysForm, if the user clicks Vesikiertoinen lämmitys as a choice, a sub input field pops up, with the value for "directElecticHeating", and the two choices yes or no. 2nd thing: For the Takka/tulisija field: add Kiertoilma Takka and Avotakka as choices. 3rd: I put a screenshot on what's wanted for talotekniikka, make sure those changes are applied. 4TH: for omat tiedot the 2nd screenshot shows the wanted changes. Make sure you sync up ALL these ** //

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t("form.steps.heating")}
      </h2>

      {/* Lämmitysmuoto (Multiple Choice) */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.heatingType")} *
          {validationErrors.heatingType && (
            <span className="text-red-500 text-sm ml-2">
              {validationErrors.heatingType}
            </span>
          )}
        </label>
        <div className="space-y-3">
          {heatingOptions.map((option) => (
            <React.Fragment key={option}>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id={`heating-${option}`}
                    name="heatingType"
                    value={option}
                    checked={formData.heatingType?.includes(option) || false}
                    onChange={handleHeatingTypeChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor={`heating-${option}`}
                    className="font-medium text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              </div>
              {/* Suora sähkölämmitys appears right under Vesikiertoinen lattialämmitys */}
              {option === t("form.options.waterCirculatedHeating") && formData.heatingType?.includes(option) && (
                <div className="mt-3 ml-6">
                  <label className="block text-base font-medium text-gray-700">
                    {t("form.options.directElectricHeating")}
                  </label>
                  <div className="flex gap-4 mt-2">
                    {[t("form.options.yes"), t("form.options.no")].map((opt) => (
                      <label key={opt} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="directElectricHeating"
                          value={opt}
                          checked={formData.directElectricHeating === opt}
                          onChange={(e) => setFormData({ ...formData, directElectricHeating: e.target.value })}
                          className="accent-blue-500"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        {showDetails.heatingTypeOther && (
          <div className="mt-3">
            <input
              type="text"
              placeholder={t("form.fields.heatingTypeOther")}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              value={formData.heatingTypeOther || ""}
              onChange={(e) =>
                setFormData({ ...formData, heatingTypeOther: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Takka/Tulisija */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.fireplace")}
        </label>
        <div className="flex flex-wrap gap-4">
          {[
            t("form.options.yes"),
            t("form.options.no"),
          ].map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`fireplace-${option}`}
                name="fireplace"
                value={option}
                checked={formData.fireplace === option}
                onChange={(e) => handleRadioChange("fireplace", e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor={`fireplace-${option}`}
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
        {showDetails.fireplace && (
          <div className="mt-4 space-y-3 pl-5 border-l-2 border-gray-200">
            <label className="block text-base font-medium text-gray-700">
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                "heatStoring",
                "airCirculationFireplace",
                "openFireplace"
              ].map((key) => (
                <div key={key} className="flex items-center">
                  <input
                    type="radio"
                    id={`fireplaceHeatStorage-${key}`}
                    name="fireplaceHeatStorage"
                    value={key}
                    checked={formData.fireplaceHeatStorage === key}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fireplaceHeatStorage: e.target.value,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`fireplaceHeatStorage-${key}`}
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    {t(`form.options.${key}`)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leivinuuni */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.bakingOven")}
        </label>
        <div className="flex flex-wrap gap-4">
          {[
            t("form.options.yes"),
            t("form.options.no"),
            t("form.options.dontKnow"),
          ].map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`bakingOven-${option}`}
                name="bakingOven"
                value={option}
                checked={formData.bakingOven === option}
                onChange={(e) =>
                  handleRadioChange("bakingOven", e.target.value)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor={`bakingOven-${option}`}
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
        {showDetails.bakingOven && (
          <div className="mt-3">
            <input
              type="text"
              placeholder={t("form.fields.bakingOvenDetails")}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              value={formData.bakingOvenDetails || ""}
              onChange={(e) =>
                setFormData({ ...formData, bakingOvenDetails: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Muu Tieto */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t("form.fields.otherInfoIndoor")}
        </label>
        <textarea
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
          rows="4"
          value={formData.otherInfoIndoor || ""}
          onChange={(e) =>
            setFormData({ ...formData, otherInfoIndoor: e.target.value })
          }
          placeholder={t("form.options.enterDetails")}
        />
      </div>
    </div>
  );
};
