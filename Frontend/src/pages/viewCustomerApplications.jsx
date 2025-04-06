import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEntries } from "../controllers/formController";
import { useOfferContext } from "../context/offerContext";
export const ViewCustomerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [openedAppIndex, setOpenedAppIndex] = useState(null);
  const navigate = useNavigate();

  // Access the OfferContext
  const { updateOfferData } = useOfferContext(); // Get the function to update offer data

  useEffect(() => {
    getAllEntries()
      .then((response) => {
        setApplications(response.entries || []);
      })
      .catch((error) => console.log(error));
  }, []);

  const parseValue = (val) => {
    if (!val) return "";
    if (val.S) return val.S;
    if (val.N) return val.N;
    if (val.L) return val.L.map(parseValue).join(", ");
    return "";
  };

  const filterEmptyValues = (formData) => {
    const result = {};
    for (let key in formData) {
      const value = parseValue(formData[key]);
      if (value && value !== "") {
        result[key] = value;
      }
    }
    return result;
  };

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

  const renderFormDataRows = (formData) => {
    const entries = Object.entries(formData);
    return entries.map(([key, value]) => {
      const label = key
        .split(/(?=[A-Z])/)
        .join(" ")
        .replace(/^\w/, (c) => c.toUpperCase());

      return (
        <div
          key={key}
          className="flex justify-between items-center py-2 border-b"
        >
          <span className="font-medium">{label}:</span>
          <span className="text-gray-700">{value}</span>
        </div>
      );
    });
  };

  const handleToggle = (index) => {
    if (openedAppIndex === index) {
      setOpenedAppIndex(null);
    } else {
      setOpenedAppIndex(index);
    }
  };

  const handleOffer = (userId, entryId, formData) => {
    // Update the context with the selected offer data

    console.log("Passing form data: ", formData);
    updateOfferData({
      userId,
      entryId,
      price: "",
      firmName: "",
      description: "",
      providerEmail: "",
      formData, // Store the form data for the current application
    });

    // Navigate to the MakeOffer page
    navigate("/makeoffer");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-6">
          View Customer Applications
        </h1>

        {applications.length === 0 ? (
          <p className="text-gray-600">No applications to display yet.</p>
        ) : (
          <div>
            {applications.map((app, index) => {
              const formData = filterEmptyValues(app.formData);
              const city = formData.kaupunki || `Application ${index + 1}`;

              return (
                <div key={app.entryId} className="mb-4">
                  <div
                    className="cursor-pointer bg-gray-200 p-4 rounded-lg flex justify-between items-center"
                    onClick={() => handleToggle(index)}
                  >
                    <div className="text-left">
                      <h2 className="text-lg font-semibold">{city}</h2>
                      <p className="text-gray-600">Status: {app.status}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent collapse toggle
                        handleOffer(app.userId, app.entryId, formData);
                      }}
                      className="ml-4 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Offer
                    </button>
                  </div>

                  <div
                    id={`appData-${index}`}
                    className={`bg-gray-100 p-4 rounded-lg mt-2 text-left transition-all ${
                      openedAppIndex === index ? "block" : "hidden"
                    }`}
                  >
                    <h3 className="font-medium mb-2">Form Data:</h3>
                    <div className="space-y-4">
                      {groupedSections.map((section) => {
                        const sectionFields = section.fields.reduce(
                          (acc, field) => {
                            if (formData[field]) {
                              acc[field] = formData[field];
                            }
                            return acc;
                          },
                          {}
                        );

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
