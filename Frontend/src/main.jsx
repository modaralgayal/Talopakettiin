import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 👈 Import this!
import "./index.css";
import App from "./App.jsx";
import { FormProvider } from "./context/formContext.jsx";
import { OfferProvider } from "./context/offerContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ Add this wrapper */}
      <FormProvider>
        <OfferProvider>
          <App />
        </OfferProvider>
      </FormProvider>
    </BrowserRouter>
  </StrictMode>
);
