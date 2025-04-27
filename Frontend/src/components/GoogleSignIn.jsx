import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";

const GoogleSignIn = ({ selectedUserType, onSignInSuccess, onSignInError }) => {
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleResponse = async (response) => {
    if (!selectedUserType) {
      onSignInError("Please select your user type first");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/user/google-auth", {
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
        onSignInSuccess(selectedUserType);
      } else {
        onSignInError(data.error || "Failed to sign in with Google");
      }
    } catch (error) {
      onSignInError("Error signing in with Google");
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

      // Initialize Google Sign-In
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

      // Render button
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
      onSignInError("Error initializing Google Sign-In. Please try again.");
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
      const timeoutId = setTimeout(initializeGoogleSignIn, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isGoogleScriptLoaded, selectedUserType]);

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6">
        <div id="google-signin" className="flex justify-center">
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleSignIn;
