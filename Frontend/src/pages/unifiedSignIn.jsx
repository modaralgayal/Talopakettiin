import React, { useState, useEffect } from "react";
import { signIn, signup } from "../controllers/userController";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBuilding } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const API_BASE_URL = "https://talopakettiin.fi";

export const UnifiedSignIn = ({ setUserType, setIsAuthenticated }) => {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const navigate = useNavigate();

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleGoogleResponse = async (response) => {
    console.log("Selected user type at response:", selectedUserType);

    if (!selectedUserType) {
      showMessage("Please select your user type first", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/google-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: response.credential,
          userType: selectedUserType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUserType(selectedUserType);
        setIsAuthenticated(true);
        showMessage("Successfully signed in with Google!", "success");
        if (selectedUserType === "customer") {
          navigate("/formpage");
        } else {
          navigate("/allapplications");
        }
      } else {
        showMessage(data.error || "Failed to sign in with Google", "error");
      }
    } catch (error) {
      showMessage("Error signing in with Google", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeGoogleSignIn = () => {
    const buttonContainer = document.getElementById("google-signin");
    if (!window.google || !buttonContainer) {
      console.log("Google or button container not ready");
      return;
    }

    try {
      // Clear existing button if any
      buttonContainer.innerHTML = "";

      // Initialize Google Sign-In with additional configuration
      window.google.accounts.id.initialize({
        // safe to expose
        client_id:
          "885359390109-ngjhjtnqng79q9j7oh21q6kqcmfe235f.apps.googleusercontent.com",
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: "signin",
        ux_mode: "popup",
        prompt_parent_id: "google-signin",
      });

      // Render new button with updated configuration
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: "outline",
        size: "large",
        width: 250,
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "center",
      });

      console.log("Google Sign-In initialized successfully");
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
      showMessage(
        "Error initializing Google Sign-In. Please try again.",
        "error"
      );
    }
  };

  // Load Google Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Google script loaded");
      setIsGoogleScriptLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, []);

  // Initialize button when script is loaded and user type is selected
  useEffect(() => {
    if (isGoogleScriptLoaded && selectedUserType) {
      console.log(
        "Initializing Google Sign-In with user type:",
        selectedUserType
      );
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(initializeGoogleSignIn, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isGoogleScriptLoaded, selectedUserType]);

  const handleUserTypeSelection = (type) => {
    console.log("Setting user type to:", type);
    setSelectedUserType(type);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {t('common.signIn')}
          </h2>
          <LanguageSwitcher />
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.selectUserType')}
        </p>

        {/* User Type Selection */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <button
            type="button"
            onClick={() => handleUserTypeSelection("customer")}
            className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all ${
              selectedUserType === "customer"
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-gray-200 hover:border-blue-300 hover:scale-105"
            }`}
          >
            <FaUser className="w-12 h-12 mb-4 text-blue-500" />
            <span className="text-xl font-semibold">{t('auth.customer.title')}</span>
            <span className="text-sm text-gray-500 mt-2">{t('auth.customer.description')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleUserTypeSelection("provider")}
            className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all ${
              selectedUserType === "provider"
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-gray-200 hover:border-blue-300 hover:scale-105"
            }`}
          >
            <FaBuilding className="w-12 h-12 mb-4 text-blue-500" />
            <span className="text-xl font-semibold">{t('auth.provider.title')}</span>
            <span className="text-sm text-gray-500 mt-2">{t('auth.provider.description')}</span>
          </button>
        </div>

        {/* Google Sign-In Container */}
        <div
          id="google-signin"
          className="flex justify-center min-h-[40px]"
        ></div>

        {!selectedUserType && (
          <p className="text-center text-sm text-gray-600">
            {t('auth.selectUserTypeFirst')}
          </p>
        )}

        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              messageType === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};
