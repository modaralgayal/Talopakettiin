// components/GoogleSignInPopup.jsx
import React, { useState, useEffect } from "react";

export const GoogleSignInPopup = ({ isOpen, onClose, onSuccess, userType }) => {
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/user/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: response.credential,
          userType: userType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(data);
        onClose();
      } else {
        showMessage(data.error || "Failed to sign in with Google");
      }
    } catch (error) {
      console.error(error);
      showMessage("Error signing in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeGoogleSignIn = () => {
    const buttonContainer = document.getElementById("google-signin-button");
    if (!window.google || !buttonContainer) return;

    try {
      buttonContainer.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(buttonContainer, {
        theme: "outline",
        size: "large",
        text: "signin_with",
      });
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
      showMessage("Error initializing Google Sign-In. Please try again.");
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isGoogleScriptLoaded && isOpen) {
      initializeGoogleSignIn();
    }
  }, [isGoogleScriptLoaded, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl relative w-80">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-center text-2xl font-bold mb-4">Kirjaudu Googlella</h2>
        <div id="google-signin-button" className="flex justify-center"></div>
        {message && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 text-center rounded">{message}</div>
        )}
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};
