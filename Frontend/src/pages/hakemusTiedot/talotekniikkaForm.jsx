import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export const TalotekniikkaForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState({
    muuTekniikka: false,
    muuTarjous: false
  });

  const technicalOptions = [
    "Automaatio",
    "Älykoti",
    "Valaistus",
    "Turvajärjestelmä",
    "Ilmanvaihto",
    "Sähköjärjestelmä",
    t('form.options.other')
  ];

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      muuTekniikka: (formData.talotekniikka || []).includes(t('form.options.other')),
      muuTarjous: (formData.tarjous || []).includes(t('form.options.other'))
    });
  }, [formData.talotekniikka, formData.tarjous, t]);

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field] || [];
    let newValues;

    if (value === t('form.options.other')) {
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(item => item !== value);
        setFormData({
          ...formData,
          [field]: newValues,
          [`${field}Muu`]: ""
        });
      } else {
        newValues = [...currentValues, value];
        setFormData({
          ...formData,
          [field]: newValues
        });
      }
    } else {
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(item => item !== value);
      } else {
        newValues = [...currentValues, value];
      }
      setFormData({
        ...formData,
        [field]: newValues
      });
    }

    setShowDetails(prev => ({
      ...prev,
      [`muu${field.charAt(0).toUpperCase() + field.slice(1)}`]: newValues.includes(t('form.options.other'))
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t('form.steps.technical')}
      </h2>

      {/* Talotekniikka */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t('form.fields.technicalFeatures')} *
          {validationErrors.talotekniikka && (
            <span className="text-red-500 text-sm ml-2">{validationErrors.talotekniikka}</span>
          )}
        </label>
        <div className="space-y-3">
          {technicalOptions.map((option) => (
            <div key={option} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id={`tekniikka-${option}`}
                  name="talotekniikka"
                  value={option}
                  checked={formData.talotekniikka?.includes(option) || false}
                  onChange={(e) => handleCheckboxChange("talotekniikka", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={`tekniikka-${option}`} className="font-medium text-gray-700">
                  {option}
                </label>
              </div>
            </div>
          ))}
        </div>
        {showDetails.muuTekniikka && (
          <div className="mt-3">
            <input
              type="text"
              placeholder={t('form.fields.technicalFeaturesOther')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              value={formData.talotekniikkaMuu || ""}
              onChange={(e) =>
                setFormData({ ...formData, talotekniikkaMuu: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Tarjous */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t('form.fields.quote')} *
          {validationErrors.tarjous && (
            <span className="text-red-500 text-sm ml-2">{validationErrors.tarjous}</span>
          )}
        </label>
        <div className="space-y-3">
          {["Kokonaisratkaisu", "Osaratkaisu", t('form.options.other')].map((option) => (
            <div key={option} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id={`tarjous-${option}`}
                  name="tarjous"
                  value={option}
                  checked={formData.tarjous?.includes(option) || false}
                  onChange={(e) => handleCheckboxChange("tarjous", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={`tarjous-${option}`} className="font-medium text-gray-700">
                  {option}
                </label>
              </div>
            </div>
          ))}
        </div>
        {showDetails.muuTarjous && (
          <div className="mt-3">
            <input
              type="text"
              placeholder={t('form.fields.quoteOther')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              value={formData.tarjousMuu || ""}
              onChange={(e) =>
                setFormData({ ...formData, tarjousMuu: e.target.value })
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
