import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const OptionRender = ({
  field,
  formData,
  setFormData,
  validationErrors,
  fieldType = "option",
  required = true,
}) => {
  const { t } = useTranslation();
  const [fieldOptions, setOptions] = useState([]);

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleCheckboxChange = (option) => {
    const current = formData[field] || [];
    let updated;
    if (current.includes(option)) {
      updated = current.filter((item) => item !== option);
    } else {
      updated = [...current, option];
    }
    setFormData({
      ...formData,
      [field]: updated,
    });
  };

  useEffect(() => {
    console.log("fetching values...");
    const fetchedVals = t(`form.options.${field}`, { returnObjects: true });
    console.log("These are the fetched values: ", fetchedVals);

    if (fetchedVals) {
      const keys = Object.keys(fetchedVals);
      setOptions(keys);
    }
  }, [field]);

  // Optional: Debug effect to confirm options are updated
  useEffect(() => {
    if (fieldOptions.length > 0) {
      console.log("Updated options:", fieldOptions);
    }
  }, [fieldOptions]);

  return (
    <>
      {fieldType == "option" && (
        <>
          <label className="block text-lg font-medium text-gray-700">
            {t(`form.fields.${field}`)} {required && "*"}
            {validationErrors[field] && (
              <span className="text-red-500 text-sm ml-2">
                {validationErrors[field]}
              </span>
            )}
          </label>

          <select
            className={`w-full p-3 border rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors[field] ? "border-red-500" : ""
            }`}
            value={formData[field] || ""}
            onChange={(e) => handleSelectChange(e.target.value)}
            required={required}
          >
            <option value="">{t(`form.options.select${field}`)}</option>
            {fieldOptions.map((option, index) => (
              <option key={index} value={option}>
                {t(`form.options.${field}.${option}`)}
              </option>
            ))}
          </select>
        </>
      )}


     {fieldType === "checkBox" && (
        <div className="mt-4">
          <label className="block text-lg font-medium text-gray-700">
            {t(`form.fields.${field}`)} {required && "*"}
            {validationErrors[field] && (
              <span className="text-red-500 text-sm ml-2">
                {validationErrors[field]}
              </span>
            )}
          </label>
          <div className="mt-2 space-y-2">
            {fieldOptions.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={(formData[field] || []).includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{t(`form.options.${field}.${option}`)}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

