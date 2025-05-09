import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { OptionRender } from "../../components/optionRender";

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

  const detailsFieldTranslationMap = {
    houseMaterialOther: "houseMaterialOther",
    roofOther: "roofOther",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        {t("form.steps.exterior")}
      </h2>

      <OptionRender
        field={"roof"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      <OptionRender
        field={"houseMaterial"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      <OptionRender
        field={"houseShape"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

        <OptionRender
        field={"houseStyle"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />


    </div>
  );
};
