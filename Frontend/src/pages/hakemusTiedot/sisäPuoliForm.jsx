import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export const SisapuoliForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();
  const initialDetailsState = {
    lattia: false,
    valiseinat: false,
    sisakatto: false,
  };

  const [showDetails, setShowDetails] = useState(initialDetailsState);

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      lattia: formData.lattia === t('form.options.other'),
      valiseinat: formData.valiseinat === t('form.options.other'),
      sisakatto: formData.sisakatto === t('form.options.other')
    });
  }, [formData.lattia, formData.valiseinat, formData.sisakatto, t]);

  const dropdownFields = [
    {
      label: t('form.fields.floor'),
      field: "lattia",
      options: ["Parketti", "Laminaatti", "Vinyyli", "Korkki", "Laatta", t('form.options.other')],
      placeholder: t('form.fields.floorDetails'),
    },
    {
      label: t('form.fields.interiorWalls'),
      field: "valiseinat",
      options: ["Kipsilevy", "Kevytbetoni", t('form.options.other')],
      placeholder: t('form.fields.interiorWallsDetails'),
    },
    {
      label: t('form.fields.ceiling'),
      field: "sisakatto",
      options: ["Puupaneeli", "Kipsilevy", "Vinyyli", t('form.options.other')],
      placeholder: t('form.fields.ceilingDetails'),
    },
  ];

  // Map Finnish details field names to English translation keys for translation
  const detailsFieldTranslationMap = {
    lattiaDetails: 'floorDetails',
    valiseinatDetails: 'interiorWallsDetails',
    sisakattoDetails: 'ceilingDetails',
  };

  const handleDropdownChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
      ...(value !== t('form.options.other') && { [`${field}Details`]: "" }),
    });
    setShowDetails(prev => ({ ...prev, [field]: value === t('form.options.other') }));
  };

  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t('form.steps.interior')}
      </h2>

      {dropdownFields.map(({ label, field, options, placeholder }) => (
        <div key={field}>
          <label className="block text-lg font-medium text-gray-700">
            {label} *
            {validationErrors[field] && (
              <span className="text-red-500 text-sm ml-2">{validationErrors[field]}</span>
            )}
          </label>
          <select
            className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors[field] ? 'border-red-500' : ''
            }`}
            value={formData[field] || ""}
            onChange={(e) => handleDropdownChange(field, e.target.value)}
            required
          >
            <option value="">{t('form.options.selectOption')}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {showDetails[field] && (
            <input
              type="text"
              placeholder={t(`form.fields.${detailsFieldTranslationMap[`${field}Details`]}`)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border mt-3"
              value={formData[`${field}Details`] || ""}
              onChange={(e) =>
                handleTextInput(`${field}Details`, e.target.value)
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};
