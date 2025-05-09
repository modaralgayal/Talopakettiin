import React from "react";
import { useTranslation } from "react-i18next";
import { OptionRender } from "../../components/optionRender";

export const KitchenForm = ({ formData, setFormData, validationErrors }) => {
  const { t } = useTranslation();

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <OptionRender
        field={"kitchenType"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />

      <OptionRender
        field={"kitchenAccessories"}
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
      />
    </div>
  );
};
