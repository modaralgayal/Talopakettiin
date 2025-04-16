import React, { useState } from "react";
import { PerustiedotForm } from "./hakemusTiedot/perusTiedot";
import { UlkopuoliForm } from "./hakemusTiedot/ulkoPuoliForm";
import { SisapuoliForm } from "./hakemusTiedot/sisäPuoliForm";
import { LämmitysForm } from "./hakemusTiedot/lämmitysForm";
import { TalotekniikkaForm } from "./hakemusTiedot/talotekniikkaForm";
import { OmatTiedotForm } from "./hakemusTiedot/omatTiedotForm";
import { useFormContext } from "../context/formContext";
import { sendFormData } from "../controllers/formController";
import "../styles/createApplication.scss";

export const ApplicationForm = () => {
  const { formData, setFormData, resetForm, isDisabled, setIsDisabled } =
    useFormContext();
  const [step, setStep] = useState(1);

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

  // Dynamically combine the values for 'budjetti' and 'talonKoko'
  const getBudjetti = () => {
    const minBudget = formData.minBudget;
    const maxBudget = formData.maxBudget;
    if (minBudget && maxBudget) {
      return `${minBudget} € - ${maxBudget} €`;
    }
    return ""; // Return empty string if not set
  };

  const getTalonKoko = () => {
    const minSize = formData.minSize;
    const maxSize = formData.maxSize;
    if (minSize && maxSize) {
      return `${minSize} m² - ${maxSize} m²`;
    }
    return ""; // Return empty string if not set
  };

  const handleSubmit = () => {
    // Dynamically combine the values before submission
    const updatedFormData = {
      ...formData,
      budjetti: getBudjetti(), // Add combined budjetti value
      talonKoko: getTalonKoko(), // Add combined talonKoko value
    };

    console.log("Form submitted with data:", updatedFormData);
    alert("Form submitted! Check console for data.");

    sendFormData(updatedFormData); // Submit the updated form data
    resetForm(); // Reset the form after submission
  };

  return (
    <div className="create-application min-h-screen bg-gray-50 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rakennushakemus
          </h1>
          <p className="text-lg text-gray-600">
            Täytä kaikki vaaditut tiedot vaiheittain
          </p>
        </div>

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
              <TalotekniikkaForm
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {step === 6 && (
              <OmatTiedotForm formData={formData} setFormData={setFormData} />
            )}
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
            {step > 1 && (
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
            )}

            {step === steps.length ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-md"
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
  );
};
