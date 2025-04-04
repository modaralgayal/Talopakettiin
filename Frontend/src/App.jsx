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
import { MyApplications } from "./pages/myApplications";
// Headers
import { Header } from "./headers/Header";
import { ProviderHeader } from "./headers/providerHeader";
import { CustomerHeader } from "./headers/customerHeader";

function App() {
  const [userType, setUserType] = useState(null);

  // Function to get userType from localStorage
  const getUserTypeFromLocalStorage = () => {
    const value = localStorage.getItem("userType");
    console.log("Usertype from localStorage is: ", value);
    return value;
  };

  // Function to handle logout
  const handleLogout = () => {
    console.log("User logged out");

    // Remove userType from localStorage
    localStorage.removeItem("userType");

    // Clear the userType state
    setUserType(null);
  };

  // Check userType from localStorage when the component mounts or whenever it changes
  useEffect(() => {
    const storedUserType = getUserTypeFromLocalStorage();
    setUserType(storedUserType); // Update the state based on localStorage value
    console.log(`Found user type in localStorage: ${storedUserType}`);
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

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
            <Route path="/formpage" element={<ApplicationForm />} />
            <Route path="/confirmuser" element={<ConfirmUser />} />
            <Route path="/viewmyapplications" element={<MyApplications />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
