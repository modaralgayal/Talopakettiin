import React, { createContext, useState, useContext, useEffect } from "react";

import { useLanguage } from "./languageContext";

const createDefaultForm = (language) => {
  const defaultFormData = {
    city: "",
    province: "",
    budjetti: "",
    talonKoko: "",
    bedrooms: "",
    kodinhoitohuone: "",
    kodinhoitohuoneDetails: "",
    mudroom: "",
    mudroomDetails: "",
    terassi: "",
    terassiDetails: "",
    autokatos: "",
    autokatosDetails: "",
    autotalli: "",
    autotalliDetails: "",

    // Ulkopuoli fields
    talonMateriaali: "",
    talonMateriaaliMuu: "",
    vesikatto: "",
    vesikattoMuu: "",

    // Sisäpuoli fields
    lattia: "",
    lattiaDetails: "",
    valiseinat: "",
    valiseinatDetails: "",
    sisakatto: "",
    sisakattoDetails: "",

    // Lämmitys fields
    lämmitysmuoto: [],
    muuLämmitysmuoto: "",
    takka: "",
    varaavuus: "",
    leivinuuni: "",
    muuTieto: "",

    // Talotekniikka fields
    minuaKiinnostaa: [],
    muuMinuaKiinnostaa: "",
    haluanTarjous: [],
    muuHaluanTarjous: "",

    // Omat Tiedot fields
    olen: [],
    vapaamuotoisiaLisatietoja: "",
  };

  return defaultFormData
};

// Create context
const FormContext = createContext({
  formData: createDefaultForm(),
  setFormData: () => {},
  resetForm: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
  validationErrors: {},
  setValidationErrors: () => {},
  validateStep: () => {},
});

export const FormProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const { currentLanguage } = useLanguage();
  console.log("Current language is: ", currentLanguage);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : createDefaultForm();
  });

  // Initialize current step from localStorage
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("formStep");
    return savedStep ? parseInt(savedStep) : 1;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // Save to localStorage whenever step changes
  useEffect(() => {
    localStorage.setItem("formStep", currentStep.toString());
  }, [currentStep]);

  // Function to validate the current step
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1: // Perustiedot
        if (!formData.kaupunki) errors.kaupunki = "Pakollinen kenttä";
        if (!formData.maakunta) errors.maakunta = "Pakollinen kenttä";
        if (!formData.bedrooms) errors.bedrooms = "Pakollinen kenttä";
        if (!formData.kodinhoitohuone)
          errors.kodinhoitohuone = "Pakollinen kenttä";
        if (!formData.arkieteinen) errors.arkieteinen = "Pakollinen kenttä";
        if (!formData.terassi) errors.terassi = "Pakollinen kenttä";
        if (!formData.autokatos) errors.autokatos = "Pakollinen kenttä";
        if (!formData.autotalli) errors.autotalli = "Pakollinen kenttä";
        break;
      case 2: // Ulkopuoli
        if (!formData.talonMateriaali)
          errors.talonMateriaali = "Pakollinen kenttä";
        if (!formData.vesikatto) errors.vesikatto = "Pakollinen kenttä";
        break;
      case 3: // Sisäpuoli
        if (!formData.lattia) errors.lattia = "Pakollinen kenttä";
        if (!formData.valiseinat) errors.valiseinat = "Pakollinen kenttä";
        if (!formData.sisakatto) errors.sisakatto = "Pakollinen kenttä";
        break;
      case 4: // Lämmitys
        if (!formData.lämmitysmuoto || formData.lämmitysmuoto.length === 0) {
          errors.lämmitysmuoto = "Valitse vähintään yksi";
        }
        break;
      case 5: // Talotekniikka
        // No required fields in this step
        break;
      case 6: // Omat Tiedot
        if (!formData.olen || formData.olen.length === 0) {
          errors.olen = "Valitse vähintään yksi";
        }
        break;
      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to update form data and clear validation errors for the updated field
  const updateFormData = (newData) => {
    setFormData(newData);

    // Clear validation errors only for the fields that were updated
    const updatedFields = Object.keys(newData);
    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      updatedFields.forEach((field) => {
        if (newData[field]) {
          delete newErrors[field];
        }
      });
      return newErrors;
    });
  };

  // Function to completely reset the form
  const resetForm = () => {
    setFormData(createDefaultForm(currentLanguage));
    setCurrentStep(1);
    setValidationErrors({});
    localStorage.removeItem("formData");
    localStorage.removeItem("formStep");
  };

  // Reset form data when language changes
  useEffect(() => {
    setFormData(createDefaultForm(currentLanguage));
    setCurrentStep(1);
    setValidationErrors({});
    localStorage.removeItem("formData");
    localStorage.removeItem("formStep");
  }, [currentLanguage]);

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData: updateFormData,
        resetForm,
        isAuthenticated,
        setIsAuthenticated,
        currentStep,
        setCurrentStep,
        validationErrors,
        setValidationErrors,
        validateStep,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
