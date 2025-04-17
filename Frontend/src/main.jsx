import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import "./index.css";
import App from "./App.jsx";
import { FormProvider } from "./context/formContext.jsx";
import { OfferProvider } from "./context/offerContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <FormProvider>
          <OfferProvider>
            <App />
          </OfferProvider>
        </FormProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
