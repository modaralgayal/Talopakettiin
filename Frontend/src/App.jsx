import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
// Pages
import { Homepage } from "./pages/homepage";
import { AboutPage } from "./pages/aboutPage";
import { ContactUsPage } from "./pages/contactUsPage";
import { UnifiedSignIn } from "./pages/unifiedSignIn";
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
import { validateToken, logOut } from "./controllers/userController";

// Define public routes that don't require authentication
const publicRoutes = ['/', '/about', '/contact', '/signin', '/confirmuser', '/formpage'];

function App() {
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("User logged out");
      setUserType(null);
      navigate("/");
    } catch (error) {
      navigate("/");
      setUserType(null);
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      // Only check session if we're not on a public route
      if (!publicRoutes.includes(location.pathname)) {
        const { isValid, userType } = await validateToken();

        if (isValid) {
          setUserType(userType);
        } else {
          handleLogout();
        }
      }
    };

    checkSession();
    // Only set up interval if we're not on a public route
    if (!publicRoutes.includes(location.pathname)) {
      const interval = setInterval(checkSession, 60000);
      return () => clearInterval(interval);
    }
  }, [location.pathname]); // Add location.pathname as a dependency

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
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route
            path="/signin"
            element={<UnifiedSignIn setUserType={setUserType} />}
          />
          <Route
            path="/formpage"
            element={
              <ApplicationForm formData={formData} setFormData={setFormData} />
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
