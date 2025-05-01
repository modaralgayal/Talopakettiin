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
import { useTranslation } from 'react-i18next';

export const ApplicationForm = (prop) => {
  const {
    formData,
    setFormData,
    resetForm,
    currentStep,
    setCurrentStep,
    validationErrors,
    validateStep,
  } = useFormContext();
  const [error, setError] = useState(null);
  const [applicationCount, setApplicationCount] = useState(null);
  const [applicationLimit, setApplicationLimit] = useState(10);
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const [showGoogleSignInPrompt, setShowGoogleSignInPrompt] = useState(false);
  const { t } = useTranslation();

  const steps = [
    { number: 1, title: t('form.steps.basicInfo') },
    { number: 2, title: t('form.steps.exterior') },
    { number: 3, title: t('form.steps.interior') },
    { number: 4, title: t('form.steps.heating') },
    { number: 5, title: t('form.steps.technical') },
    { number: 6, title: t('form.steps.personalInfo') },
  ];

  let isAuthenticated = prop.isAuthenticated;
  console.log(isAuthenticated);

  const nextStep = () => {
    if (currentStep < steps.length) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToStep = (stepNumber) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch("https://talopakettiin.fi/api/user/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: response.credential,
          userType: "customer",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowGoogleSignInPrompt(false); // close popup after success
        await handleSubmit();
      } else {
        setError(data.error || "Failed to sign in with Google");
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      setError("Error signing in with Google. Please try again.");
    }
  };

  const handleGuestSubmit = () => {
    setShowGoogleSignInPrompt(true);
  };

  const handleSubmit = async () => {
    try {
      const result = await sendFormData(formData);
      setApplicationCount(result.currentCount);
      setApplicationLimit(result.limit);
      alert("Hakemus lähetetty onnistuneesti!");
      resetForm();
      setCurrentStep(1);
      localStorage.removeItem("formData");
      localStorage.removeItem("formStep");
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

  useEffect(() => {
    if (isGoogleScriptLoaded && showGoogleSignInPrompt) {
      const container = document.getElementById("google-signin-popup");
      if (container) {
        container.innerHTML = "";
        window.google.accounts.id.initialize({
          // safe to expose.
          client_id:
            "885359390109-ngjhjtnqng79q9j7oh21q6kqcmfe235f.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          width: 250,
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "center",
        });
      }
    }
  }, [isGoogleScriptLoaded, showGoogleSignInPrompt]);

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
                    currentStep >= number
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  <span className="font-medium">{number}</span>
                </div>
                <span
                  className={`mt-3 text-sm font-medium ${
                    currentStep >= number ? "text-blue-600" : "text-gray-500"
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
            {currentStep === 1 && (
              <PerustiedotForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 2 && (
              <UlkopuoliForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 3 && (
              <SisapuoliForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 4 && (
              <LämmitysForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 5 && (
              <TalotekniikkaForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
            {currentStep === 6 && (
              <OmatTiedotForm
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
              />
            )}
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col items-center gap-4">
            <div className="flex w-full justify-between">
              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
                  }`}
                >
                  {t('navigation.previous')}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg font-medium transition-colors bg-white text-red-600 hover:bg-red-50 border border-red-300 shadow-sm"
                >
                  {t('navigation.startAgain')}
                </button>
              </div>

              {currentStep === steps.length ? (
                <button
                  onClick={isAuthenticated ? handleSubmit : handleGuestSubmit}
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
                  {t('navigation.next')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Google Sign-In Popup */}
      {showGoogleSignInPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Kirjaudu sisään</h2>
            <p className="text-gray-600 mb-6">Jatka Google-tililläsi.</p>
            <div id="google-signin-popup" className="flex justify-center"></div>

            <button
              onClick={() => setShowGoogleSignInPrompt(false)}
              className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
            >
              Sulje
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
