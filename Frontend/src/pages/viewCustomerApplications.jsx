import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllEntries,
  getOffersForProvider,
} from "../controllers/formController";
import { useOfferContext } from "../context/offerContext";
import {
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
  FaCheckCircle,
  FaTimes,
  FaEuroSign,
  FaFileAlt,
} from "react-icons/fa";

export const ViewCustomerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [providerOffers, setProviderOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openedAppIndex, setOpenedAppIndex] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const { updateOfferData } = useOfferContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersResponse, entriesResponse] = await Promise.all([
          getOffersForProvider(),
          getAllEntries()
        ]);
        
        console.log("These are the offers made by you: ", offersResponse.data.offers);
        setProviderOffers(offersResponse.data.offers || []);
        setApplications(entriesResponse.entries || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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

  const getOfferForApplication = (entryId) => {
    return providerOffers.find(offer => offer.entryId === entryId);
  };

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
  };

  const handleCloseOfferModal = () => {
    setSelectedOffer(null);
  };

  const handleOffer = (application) => {
    const customerEmail = application.customerEmail || application.email;
    if (!customerEmail) {
      alert("Customer email not found for this application");
      return;
    }

    const formData = filterEmptyValues(application.formData);
    const offerData = {
      customerEmail,
      entryId: application.entryId,
      formData,
      price: "",
      firmName: "",
      description: "",
    };
    updateOfferData(offerData);
    navigate("/makeoffer");
  };

  // Define the order of sections
  const sectionOrder = [
    {
      title: "Perustiedot",
      fields: [
        "kaupunki",
        "maakunta",
        "budjetti",
        "talonKoko",
        "makuuhuoneidenMaara",
        "kodinhoitohuone",
        "kodinhoitohuoneDetails",
        "arkieteinen",
        "arkieteinenDetails",
        "terassi",
        "terassiDetails",
        "autokatos",
        "autokatosDetails",
        "autotalli",
        "autotalliDetails",
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
        "leivinuuniDetails",
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

  // Function to format field values
  const formatFieldValue = (key, value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (key === "budjetti" && value) {
      return value;
    }
    if (key === "talonKoko" && value) {
      return value;
    }
    return value;
  };

  const filteredApplications = applications.filter((app) => {
    const formData = filterEmptyValues(app.formData);
    const searchLower = searchTerm.toLowerCase();

    return (
      (formData.kaupunki &&
        formData.kaupunki.toLowerCase().includes(searchLower)) ||
      (formData.maakunta &&
        formData.maakunta.toLowerCase().includes(searchLower))
    );
  });

  const handleToggle = (index) => {
    setOpenedAppIndex(openedAppIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kaikki hakemukset
          </h1>
          <p className="text-xl text-gray-600">
            Selaa ja suodata hakemuksia sijainnin mukaan
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="Hae kaupungin tai maakunnan mukaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Applications Grid */}
        <div className="space-y-6">
          {filteredApplications.map((app, index) => {
            const formData = filterEmptyValues(app.formData);
            const kaupunki = formData.kaupunki || "Tuntematon kaupunki";
            const isExpanded = openedAppIndex === index;
            const existingOffer = getOfferForApplication(app.entryId);

            return (
              <div
                key={app.uniqueId}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {kaupunki}
                      </h2>
                      <p className="text-lg text-gray-600">
                        Tila: {app.status}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {existingOffer ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 font-medium flex items-center">
                            <FaCheckCircle className="mr-1" />
                            Tarjous tehty
                          </span>
                          <button
                            onClick={() => handleViewOffer(existingOffer)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Katso tarjous
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOffer(app)}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <FaBuilding className="h-5 w-5 mr-2" />
                          Tee tarjous
                        </button>
                      )}
                      <button
                        onClick={() => handleToggle(index)}
                        className="text-gray-500 hover:text-gray-700 text-lg"
                      >
                        {isExpanded ? (
                          <FaChevronUp className="h-6 w-6" />
                        ) : (
                          <FaChevronDown className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Application details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {sectionOrder.map((section) => (
                      <div key={section.title} className="mb-8 last:mb-0">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                          {section.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {section.fields.map((field) => {
                            const value = formData[field];
                            if (value === undefined || value === "")
                              return null;
                            return (
                              <div
                                key={field}
                                className="bg-white p-4 rounded-lg shadow-sm"
                              >
                                <span className="block text-lg font-medium text-gray-700 mb-1">
                                  {field}
                                </span>
                                <span className="text-lg text-gray-600">
                                  {formatFieldValue(field, value)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600">Ei hakemuksia näytettäväksi</p>
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tarjouksen tiedot</h2>
                <button
                  onClick={handleCloseOfferModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Perustiedot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tila</p>
                      <p className="text-lg font-medium text-gray-900">{selectedOffer.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Päivämäärä</p>
                      <p className="text-lg font-medium text-gray-900">
                        {new Date(selectedOffer.timestamp).toLocaleDateString('fi-FI')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarjouksen sisältö</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaEuroSign className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Hinta</p>
                        <p className="text-lg font-medium text-gray-900">{selectedOffer.offerData.price} €</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaFileAlt className="h-5 w-5 text-gray-500 mr-2 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Kuvaus</p>
                        <p className="text-lg text-gray-900">{selectedOffer.offerData.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOffer.offerData.pdfFile && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Liitetiedosto</h3>
                    <a
                      href={`data:${selectedOffer.offerData.pdfFile.mimetype};base64,${selectedOffer.offerData.pdfFile.buffer}`}
                      download={selectedOffer.offerData.pdfFile.filename}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Lataa PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
