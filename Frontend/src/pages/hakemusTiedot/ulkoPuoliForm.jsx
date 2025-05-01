import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export const UlkopuoliForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState({
    talonMateriaali: false,
    vesikatto: false
  });

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      talonMateriaali: formData.talonMateriaali === t('form.options.otherWhat'),
      vesikatto: formData.vesikatto === t('form.options.otherWhat')
    });
  }, [formData.talonMateriaali, formData.vesikatto, t]);

  const handleSelectChange = (field, value) => {
    const update = { ...formData, [field]: value };

    if (field === "talonMateriaali") {
      setShowDetails(prev => ({ ...prev, talonMateriaali: value === t('form.options.otherWhat') }));
      if (value !== t('form.options.otherWhat')) {
        update.talonMateriaaliMuu = "";
      }
    }

    if (field === "vesikatto") {
      setShowDetails(prev => ({ ...prev, vesikatto: value === t('form.options.otherWhat') }));
      if (value !== t('form.options.otherWhat')) {
        update.vesikattoMuu = "";
      }
    }

    setFormData(update);
  };

  const handleTextInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Map Finnish details field names to English translation keys for translation
  const detailsFieldTranslationMap = {
    talonMateriaaliMuu: 'houseMaterialOther',
    vesikattoMuu: 'roofOther',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t('form.steps.exterior')}
      </h2>

      {/* Talon Materiaali */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t('form.fields.houseMaterial')} *
          {validationErrors.talonMateriaali && (
            <span className="text-red-500 text-sm ml-2">{validationErrors.talonMateriaali}</span>
          )}
        </label>
        <select
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white ${
            validationErrors.talonMateriaali ? 'border-red-500' : ''
          }`}
          value={formData.talonMateriaali || ""}
          onChange={(e) => handleSelectChange("talonMateriaali", e.target.value)}
        >
          <option value="">{t('form.options.selectMaterial')}</option>
          {["Puu", "Hirsi", "CLT", "Betoni/Kivi", t('form.options.otherWhat')].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {showDetails.talonMateriaali && (
          <input
            type="text"
            placeholder={t(`form.fields.${detailsFieldTranslationMap['talonMateriaaliMuu']}`)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border mt-3"
            value={formData.talonMateriaaliMuu || ""}
            onChange={(e) => handleTextInput("talonMateriaaliMuu", e.target.value)}
          />
        )}
      </div>

      {/* Vesikatto */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t('form.fields.roof')} *
          {validationErrors.vesikatto && (
            <span className="text-red-500 text-sm ml-2">{validationErrors.vesikatto}</span>
          )}
        </label>
        <select
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white ${
            validationErrors.vesikatto ? 'border-red-500' : ''
          }`}
          value={formData.vesikatto || ""}
          onChange={(e) => handleSelectChange("vesikatto", e.target.value)}
        >
          <option value="">{t('form.options.selectRoof')}</option>
          {["Pelti/Saumakatto", "Tiili", "Huopa", t('form.options.otherWhat')].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {showDetails.vesikatto && (
          <input
            type="text"
            placeholder={t(`form.fields.${detailsFieldTranslationMap['vesikattoMuu']}`)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border mt-3"
            value={formData.vesikattoMuu || ""}
            onChange={(e) => handleTextInput("vesikattoMuu", e.target.value)}
          />
        )}
      </div>
    </div>
  );
};
