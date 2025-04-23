import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PerustiedotForm } from "./hakemusTiedot/perusTiedot";
import { UlkopuoliForm } from "./hakemusTiedot/ulkoPuoliForm";
import { SisapuoliForm } from "./hakemusTiedot/sisäPuoliForm";
import { LämmitysForm } from "./hakemusTiedot/lämmitysForm";
import { TalotekniikkaForm } from "./hakemusTiedot/talotekniikkaForm";
import { OmatTiedotForm } from "./hakemusTiedot/omatTiedotForm";
import { useFormContext } from "../context/formContext";
import { sendFormData } from "../controllers/formController";
import { FaExclamationTriangle, FaCheckCircle, FaArrowRight, FaArrowLeft, FaUserPlus } from "react-icons/fa";

export const ApplicationForm = () => {
  const navigate = useNavigate();
  const { formData, setFormData, resetForm } = useFormContext();
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [applicationCount, setApplicationCount] = useState(null);
  const [applicationLimit, setApplicationLimit] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await sendFormData(formData);
      setApplicationCount(result.currentCount);
      setApplicationLimit(result.limit);
      
      if (result.isTemporary) {
        setTempUserId(result.tempUserId);
        setShowRegistrationPrompt(true);
      } else {
        alert("Hakemus lähetetty onnistuneesti!");
        resetForm();
      }
    } catch (error) {
      if (error.error === "Application limit reached") {
        setError(error.message);
        setApplicationCount(error.currentCount);
        setApplicationLimit(error.limit);
      } else {
        setError("Virhe hakemuksen lähetyksessä. Yritä uudelleen.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = () => {
    // Store the tempUserId in localStorage for later use
    localStorage.setItem('tempUserId', tempUserId);
    navigate('/signin');
  };

  const handleContinueWithoutRegistration = () => {
    alert("Hakemus lähetetty onnistuneesti! Voit rekisteröityä myöhemmin.");
    resetForm();
    setShowRegistrationPrompt(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-['Avenir']">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Täytä hakemus
          </h1>
          <p className="text-xl text-gray-600">
            Kerro meille toiveistasi ja vaatimuksistasi uuden kotisi suhteen
          </p>
        </div>

        {/* Progress Steps */}
        <div className="relative mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          <div className="flex justify-between">
            {steps.map(({ number, title }) => (
              <div
                key={number}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => goToStep(number)}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    step >= number
                      ? "border-blue-600 bg-blue-600 text-white scale-110"
                      : "border-gray-300 bg-white text-gray-400 group-hover:border-blue-400 group-hover:text-blue-400"
                  }`}
                >
                  <span className="font-medium">{number}</span>
                </div>
                <span
                  className={`mt-3 text-sm font-medium transition-colors duration-200 ${
                    step >= number ? "text-blue-600" : "text-gray-500 group-hover:text-blue-400"
                  }`}
                >
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Prompt Modal */}
        {showRegistrationPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rekisteröidy nyt</h2>
              <p className="text-gray-600 mb-6">
                Hakemuksesi on tallennettu onnistuneesti! Rekisteröitymällä voit:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Seurata hakemuksesi tilannetta</li>
                <li>Vastaanottaa tarjouksia suoraan</li>
                <li>Hallita useita hakemuksia</li>
                <li>Saada ilmoituksia uusista tarjouksista</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRegister}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaUserPlus />
                  Rekisteröidy nyt
                </button>
                <button
                  onClick={handleContinueWithoutRegistration}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Jatka ilman rekisteröitymistä
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <FaExclamationTriangle className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {step === 1 && (
              <PerustiedotForm formData={formData} setFormData={setFormData} />
            )}
            {step === 2 && (
              <UlkopuoliForm formData={formData} setFormData={setFormData} />
            )}
            {step === 3 && (
              <SisapuoliForm formData={formData} setFormData={setFormData} />
            )}
            {step === 4 && (
              <LämmitysForm formData={formData} setFormData={setFormData} />
            )}
            {step === 5 && (
              <TalotekniikkaForm formData={formData} setFormData={setFormData} />
            )}
            {step === 6 && (
              <OmatTiedotForm formData={formData} setFormData={setFormData} />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                step === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm hover:shadow-md"
              }`}
            >
              <FaArrowLeft className="mr-2" />
              Edellinen
            </button>

            {step === steps.length ? (
              <button
                onClick={handleSubmit}
                disabled={applicationCount === applicationLimit || isSubmitting}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                  applicationCount === applicationLimit || isSubmitting
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Lähetetään...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Lähetä hakemus
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
              >
                Seuraava
                <FaArrowRight className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
