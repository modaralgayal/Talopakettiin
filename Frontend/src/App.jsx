import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
// Pages
import { HomePage } from "./pages/homepage";
import { AboutPage } from "./pages/aboutPage";
import { ContactUsPage } from "./pages/contactUsPage";
import { CustomerSignIn } from "./pages/customerSignIn";
import { ProviderSignIn } from "./pages/providerSignIn";
import { ApplicationForm } from "./pages/formPage";
import { ConfirmUser } from "./pages/confirmUserPage";
import { MyApplications } from "./pages/viewMyApplications";
import { ViewCustomerApplications } from "./pages/viewCustomerApplications";
// Headers
import { Header } from "./headers/Header";
import { ProviderHeader } from "./headers/providerHeader";
import { CustomerHeader } from "./headers/customerHeader";
import MakeOffer from "./pages/makeOffer";
import GetOffers from "./pages/getOffers";
// Auth utils
import { validateToken } from "./controllers/userController";

function App() {
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");
    setUserType(null);
    navigate("/");
  };

  useEffect(() => {
    const checkSession = async () => {
      const { isValid, userType } = await validateToken();

      if (isValid) {
        setUserType(userType);
      } else {
        handleLogout();
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {userType === "customer" ? (
        <CustomerHeader handleLogout={handleLogout} />
      ) : userType === "provider" ? (
        <ProviderHeader handleLogout={handleLogout} />
      ) : (
        <Header handleLogout={handleLogout} />
      )}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route
            path="/customersignin"
            element={<CustomerSignIn setUserType={setUserType} />}
          />
          <Route
            path="/providersignin"
            element={<ProviderSignIn setUserType={setUserType} />}
          />
          <Route
            path="/formpage"
            element={
              <ApplicationForm
                formData={formData}
                setFormData={setFormData}
              />
            }
          />
          <Route path="/confirmuser" element={<ConfirmUser />} />
          <Route path="/viewmyapplications" element={<MyApplications />} />
          <Route
            path="/allapplications"
            element={<ViewCustomerApplications />}
          />
          <Route path="/makeoffer/" element={<MakeOffer />} />
          <Route path="/viewmyoffers/" element={<GetOffers />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
