import React, { createContext, useState, useContext } from 'react';

// Define the shape of your form data with exact field names matching the form
const defaultFormData = {
  // Perustiedot fields
  kaupunki: "",
  maakunta: "",
  budjetti: "",
  talonKoko: "",
  bedrooms: "",
  kodinhoitohuone: "",
  kodinhoitohuoneDetails: "",
  arkieteinen: "",
  arkieteinenDetails: "",
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

// Create context
const FormContext = createContext({
  formData: defaultFormData,
  setFormData: () => {},
  resetForm: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to completely reset the form
  const resetForm = () => {
    setFormData(defaultFormData);
  };

  return (
    <FormContext.Provider value={{ formData, setFormData, resetForm, isAuthenticated, setIsAuthenticated }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
