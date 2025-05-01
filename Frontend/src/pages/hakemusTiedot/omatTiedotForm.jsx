import React from "react";
import { useTranslation } from 'react-i18next';

export const OmatTiedotForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];

    setFormData({
      ...formData,
      [field]: newValues
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t('form.steps.personalInfo')}
      </h2>

      {/* Asiakas */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t('form.fields.customerStatus')} *
          {validationErrors.asiakas && (
            <span className="text-red-500 text-sm ml-2">{validationErrors.asiakas}</span>
          )}
        </label>
        <div className="space-y-3">
          {[
            t('form.options.privatePerson'),
            t('form.options.company'),
            t('form.options.association'),
            t('form.options.municipality')
          ].map((option) => (
            <div key={option} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id={`asiakas-${option}`}
                  name="asiakas"
                  value={option}
                  checked={formData.asiakas?.includes(option) || false}
                  onChange={(e) => handleCheckboxChange("asiakas", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={`asiakas-${option}`} className="font-medium text-gray-700">
                  {option}
                </label>
              </div>
            </div>
          ))}
        </div>
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
