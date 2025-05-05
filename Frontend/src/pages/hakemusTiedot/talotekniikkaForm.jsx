import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export const TalotekniikkaForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState({
    interestedInOther: false,
    wantsInOfferOther: false
  });

  // Use translation keys for all options
  const technicalOptions = [
    "homeAutomation",
    "solarElectricity",
    "evCharging",
    "securitySystem",
    "other"
  ];

  const quoteOptions = [
    "hvac",
    "electrical",
    "other"
  ];

  // Initialize showDetails based on formData when component mounts or formData changes
  useEffect(() => {
    setShowDetails({
      interestedInOther: (formData.interestedIn || []).includes(t('form.options.other')),
      wantsInOfferOther: (formData.wantsInOffer || []).includes(t('form.options.other'))
    });
  }, [formData.interestedIn, formData.wantsInOffer, t]);

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field] || [];
    let newValues;

    if (value === t('form.options.other')) {
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(item => item !== value);
        setFormData({
          ...formData,
          [field]: newValues,
          [`${field}Other`]: ""
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
      [`${field}Other`]: newValues.includes(t('form.options.other'))
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
          {t('form.fields.interestedIn')} *
          {validationErrors.interestedIn && (
            <span className="text-red-500 text-sm ml-2">{validationErrors.interestedIn}</span>
          )}
        </label>
        <div className="space-y-3">
          {technicalOptions.map((key) => {
            const label = key === "other" ? t('form.options.other') : t(`form.technicalOptions.${key}`);
            return (
              <div key={key} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id={`interestedIn-${key}`}
                    name="interestedIn"
                    value={key}
                    checked={formData.interestedIn?.includes(key) || false}
                    onChange={(e) => handleCheckboxChange("interestedIn", e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`interestedIn-${key}`} className="font-medium text-gray-700">
                    {label}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        {showDetails.interestedInOther && (
          <div className="mt-3">
            <input
              type="text"
              placeholder={t('form.fields.interestedInOther')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              value={formData.interestedInOther || ""}
              onChange={(e) =>
                setFormData({ ...formData, interestedInOther: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Tarjous */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          {t('form.fields.wantsInOffer')} *
          {validationErrors.wantsInOffer && (
            <span className="text-red-500 text-sm ml-2">{validationErrors.wantsInOffer}</span>
          )}
        </label>
        <div className="space-y-3">
          {quoteOptions.map((key) => {
            const label = key === "other" ? t('form.options.other') : t(`form.quoteOptions.${key}`);
            return (
              <div key={key} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id={`wantsInOffer-${key}`}
                    name="wantsInOffer"
                    value={key}
                    checked={formData.wantsInOffer?.includes(key) || false}
                    onChange={(e) => handleCheckboxChange("wantsInOffer", e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`wantsInOffer-${key}`} className="font-medium text-gray-700">
                    {label}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        {showDetails.wantsInOfferOther && (
          <div className="mt-3">
            <input
              type="text"
              placeholder={t('form.fields.wantsInOfferOther')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
              value={formData.wantsInOfferOther || ""}
              onChange={(e) => setFormData({ ...formData, wantsInOfferOther: e.target.value })}
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
          value={formData.otherInfo || ""}
          onChange={(e) => setFormData({ ...formData, otherInfo: e.target.value })}
          placeholder={t('form.options.enterDetails')}
        />
      </div>
    </div>
  );
};
