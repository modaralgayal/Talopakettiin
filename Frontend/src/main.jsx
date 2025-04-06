import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { FormProvider } from "./context/formContext.jsx"; // Assuming your FormContext is here
import { OfferProvider } from "./context/offerContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FormProvider>
      <OfferProvider>
        <App />
      </OfferProvider>
    </FormProvider>
  </StrictMode>
);
