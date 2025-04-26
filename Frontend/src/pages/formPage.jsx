import React, { useState, useEffect } from "react";
import { PerustiedotForm } from "./hakemusTiedot/perusTiedot";
import { UlkopuoliForm } from "./hakemusTiedot/ulkoPuoliForm";
import { SisapuoliForm } from "./hakemusTiedot/sisäPuoliForm";
import { LämmitysForm } from "./hakemusTiedot/lämmitysForm";
import { TalotekniikkaForm } from "./hakemusTiedot/talotekniikkaForm";
import { OmatTiedotForm } from "./hakemusTiedot/omatTiedotForm";
import { useFormContext } from "../context/formContext";
import { sendFormData } from "../controllers/formController";
import { FaExclamationTriangle } from "react-icons/fa";

export const ApplicationForm = () => {
  const { formData, setFormData, resetForm, isAuthenticated, setIsAuthenticated } = useFormContext();
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [applicationCount, setApplicationCount] = useState(null);
  const [applicationLimit, setApplicationLimit] = useState(10);
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  const steps = [
    { number: 1, title: "Perustiedot" },
    { number: 2, title: "Ulkopuoli" },
    { number: 3, title: "Sisäpuoli" },
    { number: 4, title: "Lämmitys" },
    { number: 5, title: "Talotekniikka" },
    { number: 6, title: "Omat Tiedot" },
  ];

  const nextStep = () => {
    if (step < steps.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch("http://localhost:8000/api/user/google-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: response.credential,
          userType: "customer", // Set default user type for guest submissions
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update authentication state in context
        setIsAuthenticated(true);
        // Submit the form data
        await handleSubmit();
      } else {
        setError(data.error || "Failed to sign in with Google");
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      setError("Error signing in with Google. Please try again.");
    }
  };

  const initializeGoogleSignIn = () => {
    const buttonContainer = document.getElementById("google-signin");
    if (!window.google || !buttonContainer) {
      console.log("Google or button container not ready");
      return;
    }

    try {
      buttonContainer.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: "popup",
        prompt_parent_id: "google-signin",
      });

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
    }
  };

  const handleGuestSubmit = () => {
    if (!isGoogleScriptLoaded) {
      setError("Google Sign-In is not ready yet. Please try again in a moment.");
      return;
    }
    
    // Initialize Google Sign-In for guest submission
    const buttonContainer = document.getElementById("google-signin");
    if (!buttonContainer) {
      setError("Sign-in container not found. Please refresh the page.");
      return;
    }

    try {
      buttonContainer.innerHTML = "";
      
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: "popup",
        prompt_parent_id: "google-signin",
      });

      window.google.accounts.id.renderButton(buttonContainer, {
        theme: "outline",
        size: "large",
        width: 250,
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "center",
      });

      // Prompt the user to sign in
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
      setError("Error initializing Google Sign-In. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await sendFormData(formData);
      setApplicationCount(result.currentCount);
      setApplicationLimit(result.limit);
      alert("Hakemus lähetetty onnistuneesti!");
      resetForm();
    } catch (error) {
      if (error.error === "Authentication Error") {
        setError(error.message);
        setTimeout(() => {
          window.location.href = "/signin";
        }, 3000);
      } else if (error.error === "Application limit reached") {
        setError(error.message);
        setApplicationCount(error.currentCount);
        setApplicationLimit(error.limit);
      } else {
        setError("Virhe hakemuksen lähetyksessä. Yritä uudelleen.");
      }
    }
  };

  // Load Google Script once
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
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rakennushakemus
          </h1>
          <p className="text-lg text-gray-600">
            Täytä kaikki vaaditut tiedot vaiheittain
          </p>
          {applicationCount !== null && (
            <div className="mt-4 text-sm text-gray-600">
              Hakemuksia: {applicationCount} / {applicationLimit}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="relative mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          <div className="flex justify-between">
            {steps.map(({ number, title }) => (
              <div
                key={number}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => goToStep(number)}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-colors ${
                    step >= number
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  <span className="font-medium">{number}</span>
                </div>
                <span
                  className={`mt-3 text-sm font-medium ${
                    step >= number ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8">
            {step === 1 && <PerustiedotForm formData={formData} setFormData={setFormData} />}
            {step === 2 && <UlkopuoliForm formData={formData} setFormData={setFormData} />}
            {step === 3 && <SisapuoliForm formData={formData} setFormData={setFormData} />}
            {step === 4 && <LämmitysForm formData={formData} setFormData={setFormData} />}
            {step === 5 && <TalotekniikkaForm formData={formData} setFormData={setFormData} />}
            {step === 6 && <OmatTiedotForm formData={formData} setFormData={setFormData} />}
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col items-center gap-4">
            <div id="google-signin" className="flex justify-center min-h-[40px]"></div>

            <div className="flex w-full justify-between">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  step === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
                }`}
              >
                Edellinen
              </button>

              {step === steps.length ? (
                <button
                  onClick={handleGuestSubmit}
                  disabled={applicationCount === applicationLimit}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    applicationCount === applicationLimit
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 shadow-md"
                  }`}
                >
                  Lähetä hakemus
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md"
                >
                  Seuraava
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
