import React, { useEffect, useState } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
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
const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/signin",
  "/confirmuser",
  "/formpage",
];

function App() {
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("User logged out");
      setUserType(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      navigate("/");
      setUserType(null);
      setIsAuthenticated(false);
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      try {
        const { isValid, userType } = await validateToken();
    
        if (isValid) {
          setUserType(userType);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUserType(null);
          // Only redirect if not on a public route
          if (!publicRoutes.includes(location.pathname)) {
            navigate('/signin');
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    checkSession();
  
    // Set up interval for session check
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, []); // Only run on mount, remove location.pathname dependency

  // Protected route wrapper component
  const ProtectedRoute = ({ children }) => {
    // If still loading, don't redirect yet
    if (isLoading) {
      return null; // or a loading spinner component
    }

    // Only redirect if not authenticated and not on a public route
    if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  // If initial loading, show nothing or a loading spinner
  if (isLoading) {
    return null; // or a loading spinner component
  }

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
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/confirmuser" element={<ConfirmUser />} />
          <Route
            path="/signin"
            element={
              <UnifiedSignIn
                setUserType={setUserType}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/formpage"
            element={
              <ApplicationForm formData={formData} setFormData={setFormData} />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/viewmyapplications"
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allapplications"
            element={
              <ProtectedRoute>
                <ViewCustomerApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/makeoffer"
            element={
              <ProtectedRoute>
                <MakeOffer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewmyoffers"
            element={
              <ProtectedRoute>
                <GetOffers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
