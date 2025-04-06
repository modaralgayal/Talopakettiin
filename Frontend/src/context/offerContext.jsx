import React, { createContext, useContext, useState } from "react";

// Initial state for offerData
const initialOfferData = {
  userId: "",
  entryId: "",
  price: "",
  firmName: "",
  description: "",
  providerEmail: "",
  formData: {}, // This is where the formData will be stored
};

// Create the context
const OfferContext = createContext();

// Custom hook to use the OfferContext
export const useOfferContext = () => {
  return useContext(OfferContext);
};

// Provider component to wrap around the app
export const OfferProvider = ({ children }) => {
  const [offerData, setOfferData] = useState(initialOfferData);

  const updateOfferData = (data) => {
    setOfferData(data); // Update the offer data
  };

  return (
    <OfferContext.Provider value={{ offerData, updateOfferData }}>
      {children}
    </OfferContext.Provider>
  );
};
