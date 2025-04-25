import React, { useEffect, useState } from "react";
import { getUserForms, deleteUserEntry } from "../controllers/formController";
import { FaTrash, FaChevronDown, FaChevronUp, FaExclamationTriangle } from "react-icons/fa";

export const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    entryId: null,
    kaupunki: null
  });

  const fetchApplications = async () => {
    try {
      const response = await getUserForms();
      console.log("Fetched applications:", response);
      
      // Ensure each application has a unique ID and valid entryId
      const uniqueApplications = response.map((app, index) => {
        console.log(`Processing application ${index}:`, app);
        return {
          ...app,
          uniqueId: `${app.entryId}-${index}`,
          entryId: app.entryId || `temp-${index}` // Ensure entryId is never undefined
        };
      });
      
      console.log("Processed applications with unique IDs:", uniqueApplications);
      setApplications(uniqueApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDeleteClick = (entryId, kaupunki) => {
    console.log("Delete clicked for entryId:", entryId, "kaupunki:", kaupunki);
    
    if (!entryId) {
      console.error("Invalid entryId:", entryId);
      setDeleteError("Invalid application ID. Please try again.");
      return;
    }
    
    setDeleteConfirmation({
      show: true,
      entryId,
      kaupunki
    });
  };

  const handleDeleteConfirm = async () => {
    console.log("Delete confirmed for entryId:", deleteConfirmation.entryId);
    
    if (!deleteConfirmation.entryId) {
      console.error("Invalid entryId in confirmation:", deleteConfirmation.entryId);
      setDeleteError("Invalid application ID. Please try again.");
      setDeleteConfirmation({ show: false, entryId: null, kaupunki: null });
      return;
    }

    try {
      console.log("Attempting to delete entryId:", deleteConfirmation.entryId);
      await deleteUserEntry(deleteConfirmation.entryId);
      console.log("Successfully deleted entryId:", deleteConfirmation.entryId);
      
      setDeleteError(null);
      setDeleteConfirmation({ show: false, entryId: null, kaupunki: null });
      fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      setDeleteError("Error deleting application. Please try again.");
    }
  };

  const handleDeleteCancel = () => {
    console.log("Delete cancelled");
    setDeleteConfirmation({ show: false, entryId: null, kaupunki: null });
  };

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
  const renderFormDataRows = (formData, sectionTitle) => {
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
          key={`${sectionTitle}-${key}`}
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Omat hakemukset
          </h1>
          <p className="text-lg text-gray-600">
            Tarkastele ja hallitse hakemuksiasi
          </p>
        </div>

        {deleteError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{deleteError}</p>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">
              Sinulla ei ole vielä hakemuksia.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application, index) => {
              const formData = filterEmptyValues(application.formData);
              const kaupunki = formData.kaupunki || "Tuntematon kaupunki";
              const isExpanded = expandedIndex === index;

              return (
                <div
                  key={application.uniqueId}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {kaupunki}
                        </h2>
                        <p className="text-gray-600">
                          Tila: {application.status}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? null : index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {isExpanded ? (
                            <FaChevronUp className="h-5 w-5" />
                          ) : (
                            <FaChevronDown className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(application.id, kaupunki)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-6 space-y-6">
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
                              <div key={`${application.uniqueId}-${section.title}`}>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                  {section.title}
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                  {renderFormDataRows(sectionFields, section.title)}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmation.show && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <FaExclamationTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">
                  Vahvista poisto
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Haluatko varmasti poistaa hakemuksen kaupungista "{deleteConfirmation.kaupunki}"?
                Tätä toimintoa ei voi perua.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Peruuta
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Poista
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
