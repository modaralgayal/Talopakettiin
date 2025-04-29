import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEntryIds } from "../controllers/formController";
import { getProviderOffers } from "../controllers/offerController";
import { FaChevronDown, FaChevronUp, FaBuilding, FaEuroSign, FaRuler } from "react-icons/fa";

const AllApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [providerOffers, setProviderOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsResponse, offersResponse] = await Promise.all([
          getAllEntryIds(),
          getProviderOffers()
        ]);
        
        console.log("Applications:", applicationsResponse.entries);
        console.log("Provider Offers:", offersResponse.data?.offers);
        
        setApplications(applicationsResponse.entries || []);
        setProviderOffers(offersResponse.data?.offers || []);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMakeOffer = (application) => {
    navigate("/makeoffer", { state: { application } });
  };

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
  };

  const handleCloseOfferModal = () => {
    setSelectedOffer(null);
  };

  const getOfferForApplication = (entryId) => {
    console.log("Looking for offer with entryId:", entryId);
    console.log("Available offers:", providerOffers);
    const offer = providerOffers.find(offer => offer.entryId === entryId);
    console.log("Found offer:", offer);
    return offer;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Applications</h1>
          <p className="text-xl text-gray-600">View and make offers for applications</p>
        </div>

        <div className="space-y-4">
          {applications.map((application) => {
            const existingOffer = getOfferForApplication(application.entryId);
            const isExpanded = expandedApplication === application.entryId;

            return (
              <div
                key={application.entryId}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Application from {application.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-gray-600">
                          <FaBuilding className="mr-2" />
                          <span>{application.formData?.talonKoko || "N/A"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaEuroSign className="mr-2" />
                          <span>{application.formData?.budjetti || "N/A"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaRuler className="mr-2" />
                          <span>{application.formData?.makuuhuoneidenMaara || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {existingOffer ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 font-medium">Offer Made</span>
                          <button
                            onClick={() => handleViewOffer(existingOffer)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View Offer
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleMakeOffer(application)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Make Offer
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedApplication(isExpanded ? null : application.entryId)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                      >
                        {isExpanded ? (
                          <FaChevronUp className="h-5 w-5" />
                        ) : (
                          <FaChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(application.formData || {}).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-4 rounded-lg">
                            <span className="block text-sm font-medium text-gray-700 mb-1">
                              {key}
                            </span>
                            <span className="text-sm text-gray-600">
                              {Array.isArray(value) ? value.join(", ") : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offer Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Offer</h2>
              <button
                onClick={handleCloseOfferModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaChevronUp className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Firm Name</h3>
                <p className="text-gray-600">{selectedOffer.offerData?.firmName}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Price</h3>
                <p className="text-gray-600">{selectedOffer.offerData?.price} €</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600">{selectedOffer.offerData?.description}</p>
              </div>
              {selectedOffer.offerData?.pdfFile && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Attached PDF</h3>
                  <a
                    href={`data:application/pdf;base64,${selectedOffer.offerData.pdfFile.buffer}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllApplications; 