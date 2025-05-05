import React, { useEffect, useState } from "react";
import { getUserForms, deleteUserEntry } from "../controllers/formController";
import { FaTrash, FaChevronDown, FaChevronUp, FaExclamationTriangle, FaEdit } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

export const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    entryId: null,
    kaupunki: null
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const response = await getUserForms();
      //console.log("Fetched applications:", response);
      
      // Ensure each application has a unique ID and valid entryId
      const uniqueApplications = response.map((app, index) => {
        console.log(`Processing application ${index}:`, app);
        return {
          ...app,
          uniqueId: `${app.entryId}-${index}`,
          entryId: app.entryId || `temp-${index}` // Ensure entryId is never undefined
        };
      });
      
      //console.log("Processed applications with unique IDs:", uniqueApplications);
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
      // Get the translated label for the field
      const label = t(`form.fields.${key}`);

      // Special handling for different field types
      if (["interestedIn", "wantsInOffer"].includes(key)) {
        let displayValue = "-";
        if (Array.isArray(value) && value.length > 0) {
          // Try to translate each value based on the field type
          displayValue = value
            .map((v) => {
              if (key === "interestedIn") {
                return t(`form.technicalOptions.${v}`) !== `form.technicalOptions.${v}` 
                  ? t(`form.technicalOptions.${v}`) 
                  : v;
              }
              if (key === "wantsInOffer") {
                return t(`form.quoteOptions.${v}`) !== `form.quoteOptions.${v}` 
                  ? t(`form.quoteOptions.${v}`) 
                  : v;
              }
              return v;
            })
            .join(", ");
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle yes/no/dontKnow fields
      if (["utilityRoom", "mudroom", "terrace", "carport", "garage", "fireplace", "bakingOven"].includes(key)) {
        const displayValue = value === t("form.options.yes") ? t("form.options.yes") : 
                           value === t("form.options.no") ? t("form.options.no") : 
                           value === t("form.options.dontKnow") ? t("form.options.dontKnow") :
                           value || "-";
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle select fields with predefined options
      if (["houseMaterial", "roof", "floor", "interiorWalls", "ceiling"].includes(key)) {
        let displayValue = "-";
        if (value) {
          // Try to translate the value
          const translated = t(`form.options.${value}`);
          displayValue = translated !== `form.options.${value}` ? translated : value;
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle heating type array
      if (key === "heatingType") {
        let displayValue = "-";
        if (Array.isArray(value) && value.length > 0) {
          displayValue = value
            .map(v => {
              const translated = t(`form.options.${v}`);
              return translated !== `form.options.${v}` ? translated : v;
            })
            .join(", ");
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle customer status
      if (key === "customerStatus") {
        let displayValue = "-";
        if (value) {
          const translated = t(`form.options.${value}`);
          displayValue = translated !== `form.options.${value}` ? translated : value;
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle fireplaceHeatStorage and directElectricHeating with translation
      if (["fireplaceHeatStorage", "directElectricHeating"].includes(key)) {
        let displayValue = "-";
        if (value) {
          const translated = t(`form.options.${value}`);
          displayValue = translated !== `form.options.${value}` ? translated : value;
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle hasPlot with translation
      if (key === "hasPlot") {
        let displayValue = "-";
        if (value) {
          const translated = t(`form.options.${value}`);
          displayValue = translated !== `form.options.${value}` ? translated : value;
        }
        return (
          <div
            key={`${sectionTitle}-${key}`}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-medium">{label}:</span>
            <span className="text-gray-700">{displayValue}</span>
          </div>
        );
      }

      // Handle other fields (city, province, budget, etc.)
      const displayValue = value || "-";
      return (
        <div
          key={`${sectionTitle}-${key}`}
          className="flex justify-between items-center py-2 border-b"
        >
          <span className="font-medium">{label}:</span>
          <span className="text-gray-700">{displayValue}</span>
        </div>
      );
    });
  };

  // Define the order of sections
  const sectionOrder = [
    {
      title: t("form.steps.basicInfo"),
      fields: [
        "city",
        "province",
        "budget",
        "houseSize",
        "bedrooms",
        "utilityRoom",
        "utilityRoomDetails",
        "mudroom",
        "mudroomDetails",
        "terrace",
        "terraceDetails",
        "carport",
        "carportDetails",
        "garage",
        "garageDetails",
      ],
    },
    {
      title: t("form.steps.exterior"),
      fields: [
        "houseMaterial",
        "houseMaterialOther",
        "roof",
        "roofOther",
      ],
    },
    {
      title: t("form.steps.interior"),
      fields: [
        "floor",
        "floorDetails",
        "interiorWalls",
        "interiorWallsDetails",
        "ceiling",
        "ceilingDetails",
      ],
    },
    {
      title: t("form.steps.heating"),
      fields: [
        "heatingType",
        "heatingTypeOther",
        "fireplace",
        "fireplaceHeatStorage",
        "directElectricHeating",
        "bakingOven",
        "bakingOvenDetails",
        "otherInfoIndoor",
      ],
    },
    {
      title: t("form.steps.technical"),
      fields: [
        "interestedIn",
        "interestedInOther",
        "wantsInOffer",
        "wantsInOfferOther",
      ],
    },
    {
      title: t("form.steps.personalInfo"),
      fields: [
        "customerStatus",
        "hasPlot",
        "additionalInfo",
      ],
    },
  ];

  // Function to format field values
  const formatFieldValue = (key, value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (key === "budget" && value) {
      return value;
    }
    if (key === "houseSize" && value) {
      return value;
    }
    return value;
  };

  const filteredApplications = applications.filter((app) => {
    const formData = filterEmptyValues(app.formData);
    const searchLower = searchTerm.toLowerCase();

    return (
      (formData.city &&
        formData.city.toLowerCase().includes(searchLower)) ||
      (formData.province &&
        formData.province.toLowerCase().includes(searchLower))
    );
  });

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

        {/* Add search input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Hae kaupungin tai maakunnan perusteella..."
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            {filteredApplications.map((application, index) => {
              const formData = filterEmptyValues(application.formData);
              const kaupunki = formData.city || "Tuntematon kaupunki";
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
                          onClick={() => {
                            navigate("/formpage", { state: { formData, id: application.id, entryId: application.entryId, edit: true } });
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                        >
                          <FaEdit className="h-4 w-4" />
                          <span>Edit</span>
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
                        {sectionOrder.map((section) => {
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
