import React, { useEffect, useState } from "react";
import { getUserForms } from "../controllers/formController";

export const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getUserForms()
      .then((response) => {
        console.log("This is the response from the server", response);
        setApplications(response.applications); // Store applications in state
      })
      .catch((error) => console.log(error));
  }, []);

  // Function to filter out empty or undefined values
  const filterEmptyValues = (obj) => {
    const result = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value && value !== "") {
          result[key] = value;
        }
      }
    }
    return result;
  };

  // Function to render rows for each key-value pair
  const renderFormDataRows = (formData) => {
    const entries = Object.entries(formData);
    return entries.map(([key, value]) => {
      // Format the key to be a readable label (e.g., "maxSize" => "Max Size")
      const label = key
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/^\w/, (c) => c.toUpperCase());

      // Check if the value is an array and handle accordingly
      const formattedValue = Array.isArray(value) ? value.join(", ") : value;

      return (
        <div
          key={key}
          className="flex justify-between items-center py-2 border-b"
        >
          <span className="font-medium">{label}:</span>
          <span className="text-gray-700">{formattedValue}</span>
        </div>
      );
    });
  };

  // Grouped sections based on the structure of the form data
  const groupedSections = [
    {
      title: "Perustiedot",
      fields: [
        "kaupunki",
        "maakunta",
        "budjetti",
        "talonKoko",
        "makuuhuoneidenMaara",
        "kodinhoitohuone",
        "arkieteinen",
        "terassi",
        "autokatos",
        "autotalli",
      ],
    },
    {
      title: "Ulkopuoli",
      fields: [
        "talonMateriaali",
        "talonMateriaaliMuu",
        "vesikatto",
        "vesikattoMuu",
      ],
    },
    {
      title: "Sisäpuoli",
      fields: [
        "lattia",
        "lattiaDetails",
        "valiseinat",
        "valiseinatDetails",
        "sisakatto",
        "sisakattoDetails",
      ],
    },
    {
      title: "Lämmitys",
      fields: [
        "lämmitysmuoto",
        "muuLämmitysmuoto",
        "takka",
        "varaavuus",
        "leivinuuni",
        "muuTieto",
      ],
    },
    {
      title: "Talotekniikka",
      fields: [
        "minuaKiinnostaa",
        "muuMinuaKiinnostaa",
        "haluanTarjous",
        "muuHaluanTarjous",
      ],
    },
    { title: "Omat Tiedot", fields: ["olen", "vapaamuotoisiaLisatietoja"] },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-6">View Your Applications</h1>

        {/* Render message when no applications */}
        {applications.length === 0 ? (
          <p className="text-gray-600">You don't have any applications yet.</p>
        ) : (
          // Render each application's formData
          <div>
            {applications.map((application, index) => {
              const formData = filterEmptyValues(application.formData);
              const kaupunki = formData.kaupunki || "Unknown City"; // Default to 'Unknown City' if kaupunki is missing

              return (
                <div key={application.entryId} className="mb-4">
                  {/* Collapsible section title based on 'kaupunki' */}
                  <div
                    className="cursor-pointer bg-gray-200 p-4 rounded-lg"
                    onClick={() =>
                      document
                        .getElementById(`formData-${index}`)
                        .classList.toggle("hidden")
                    }
                  >
                    <h2 className="text-lg font-semibold">{kaupunki}</h2>
                    <p className="text-gray-600">
                      Status: {application.status}
                    </p>
                  </div>

                  {/* Collapsible content */}
                  <div
                    id={`formData-${index}`}
                    className="hidden bg-gray-100 p-4 rounded-lg mt-2"
                  >
                    <h3 className="font-medium mb-2">Form Data:</h3>

                    {/* Render each section */}
                    <div className="space-y-4">
                      {groupedSections.map((section) => {
                        // Filter the fields that exist in the current section
                        const sectionFields = section.fields.reduce(
                          (acc, field) => {
                            if (formData[field]) {
                              acc[field] = formData[field];
                            }
                            return acc;
                          },
                          {}
                        );

                        // Only render the section if it has any fields
                        if (Object.keys(sectionFields).length > 0) {
                          return (
                            <div key={section.title}>
                              <h4 className="text-xl font-semibold">
                                {section.title}
                              </h4>
                              <div className="space-y-2">
                                {renderFormDataRows(sectionFields)}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
