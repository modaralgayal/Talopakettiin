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
import Header from "./components/Header";
// import { ProviderHeader } from "./components/Header/providerHeader";
// import { CustomerHeader } from "./components/Header/customerHeader";
// import MainMenu from "./components/MainMenu/MainMenu";

import MakeOffer from "./pages/makeOffer";
import GetOffers from "./pages/getOffers";
// Auth utils
import { validateToken, logOut } from "./controllers/userController";
import { useDispatch } from "react-redux";
import { setUserType } from "./redux/slices/userSlice";
import { useAuth } from "./hooks/useAuth";

import "./styles/main.scss";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const dispatch = useDispatch();
  const { handleLogout } = useAuth();

  // const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState();
  const navigate = useNavigate();

  //Fixed an issue where checkSession was triggered for unregistered users, causing errors.
  useEffect(() => {
    const checkSession = async () => {
      const authStatus = JSON.parse(localStorage.getItem("authStatus"));
      if (!authStatus) return;
      const { isValid, userType } = await validateToken();

      if (isValid) {
        dispatch(setUserType(userType));
      } else {
        handleLogout();
      }
    };
    checkSession();

    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div>
      {/* {userType === "customer" ? (
        <CustomerHeader handleLogout={handleLogout} />
      ) : userType === "provider" ? (
        <ProviderHeader handleLogout={handleLogout} />
      ) : (
        <Header handleLogout={handleLogout} />
      )} */}
      <Header />

      <main data-aos="fade-up">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/customersignin" element={<CustomerSignIn />} />
          <Route
            path="/providersignin"
            element={<ProviderSignIn setUserType={setUserType} />}
          />
          {/* <Route
            path="/customersignin"
            element={<CustomerSignIn setUserType={setUserType} />}
          />
          <Route
            path="/providersignin"
            element={<ProviderSignIn setUserType={setUserType} />}
          /> */}
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
