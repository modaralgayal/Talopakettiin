import React, { createContext, useState, useContext } from 'react';

// Define the shape of your form data
const defaultFormData = {
  // Perustiedot fields
  kaupunki: "",  // City
  maakunta: "",  // Province/region
  budjetti: "",  // Budget (€)
  talonKoko: "",  // House size (m²)
  makuuhuoneidenMaara: "",  // Number of bedrooms
  kodinhoitohuone: "",  // Utility room (Yes/No)
  arkieteinen: "",  // Arki entrance (Yes/No)
  terassi: "",  // Terrace (Yes/No)
  autokatos: "",  // Carport (Yes/No)
  autotalli: "",

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
});

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState(defaultFormData);

  // Function to completely reset the form
  const resetForm = () => {
    setFormData(defaultFormData);
  };

  return (
    <FormContext.Provider value={{ formData, setFormData, resetForm }}>
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
