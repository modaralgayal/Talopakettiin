import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export const LämmitysForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState({
    muuLämmitys: false,
    takka: false,
    leivinuuni: false
  });

  const heatingOptions = [
    "Ilmalämpöpumppu",
    "Maalämpö",
    "Sähkö",
    "Öljy",
    "Puulämmitys",
    "Kaukolämpö",
    t('form.options.other')
  ];

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      muuLämmitys: (formData.lämmitysmuoto || []).includes(t('form.options.other')),
      takka: formData.takka === t('form.options.yes'),
      leivinuuni: formData.leivinuuni === t('form.options.yes')
    });
  }, [formData.lämmitysmuoto, formData.takka, formData.leivinuuni, t]);

  const handleLämmitysmuotoChange = (e) => {
    const value = e.target.value;
    const currentValues = formData.lämmitysmuoto || [];
    let newValues;

    if (e.target.checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(item => item !== value);
    }

    setFormData({
      ...formData,
      lämmitysmuoto: newValues,
      ...(value === t('form.options.other') && !e.target.checked && { muuLämmitysmuoto: "" })
    });

    setShowDetails(prev => ({
      ...prev,
      muuLämmitys: newValues.includes(t('form.options.other'))
    }));
  };

  const handleRadioChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
      ...(field === "takka" && value !== t('form.options.yes') && { varaavuus: "" }),
      ...(field === "leivinuuni" && value !== t('form.options.yes') && { leivinuuniDetails: "" })
    });

    setShowDetails(prev => ({
      ...prev,
      [field]: value === t('form.options.yes')
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t('form.steps.heating')}
      </h2>

      {/* Lämmitysmuoto (Multiple Choice) */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t('form.fields.heatingType')} *
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
        {showDetails.muuLämmitys && (
          <div className="mt-3">
            <input
              type="text"
              placeholder={t('form.fields.heatingTypeOther')}
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
        <label className="block text-lg font-medium text-gray-700">
          {t('form.fields.fireplace')}
        </label>
        <div className="flex flex-wrap gap-4">
          {[t('form.options.yes'), t('form.options.no'), t('form.options.dontKnow')].map((option) => (
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
        {showDetails.takka && (
          <div className="mt-4 space-y-3 pl-5 border-l-2 border-gray-200">
            <label className="block text-base font-medium text-gray-700">
              {t('form.fields.fireplaceHeatStorage')}
            </label>
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
        <label className="block text-lg font-medium text-gray-700">
          {t('form.fields.bakingOven')}
        </label>
        <div className="flex flex-wrap gap-4">
          {[t('form.options.yes'), t('form.options.no'), t('form.options.dontKnow')].map((option) => (
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
        {showDetails.leivinuuni && (
          <div className="mt-3">
            <input
              type="text"
              placeholder={t('form.fields.bakingOvenDetails')}
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
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t('form.fields.otherInfo')}
        </label>
        <textarea
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
          rows="4"
          value={formData.muuTieto || ""}
          onChange={(e) => setFormData({ ...formData, muuTieto: e.target.value })}
          placeholder={t('form.options.enterDetails')}
        />
      </div>
    </div>
  );
};