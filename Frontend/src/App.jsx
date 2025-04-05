import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Pages
import { HomePage } from "./pages/homepage";
import { AboutPage } from "./pages/aboutPage";
import { ContactUsPage } from "./pages/contactUsPage";
import { CustomerSignIn } from "./pages/customerSignIn";
import { ProviderSignIn } from "./pages/providerSignIn";
import { ApplicationForm } from "./pages/formPage";
import { ConfirmUser } from "./pages/confirmUserPage";
import { MyApplications } from "./pages/viewMyApplications";
// Headers
import { Header } from "./headers/Header";
import { ProviderHeader } from "./headers/providerHeader";
import { CustomerHeader } from "./headers/customerHeader";

function App() {
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState();

  // Function to get userType from localStorage
  const getUserTypeFromLocalStorage = () => {
    const value = localStorage.getItem("userType");
    console.log("Usertype from localStorage is: ", value);
    return value;
  };

  // Function to handle logout
  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem("userType");
    setUserType(null);
  };

  // Check userType from localStorage on mount
  useEffect(() => {
    const storedUserType = getUserTypeFromLocalStorage();
    setUserType(storedUserType);
    localStorage.setItem("formData", JSON.stringify(formData));
    console.log(`Found user type in localStorage: ${storedUserType}`);
  }, []);

  return (
    <Router>
      <div>
        {/* Conditionally render the header based on userType */}
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
