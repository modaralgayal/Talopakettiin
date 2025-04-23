import React, { useEffect, useState } from "react";
import { getOffersForUser, acceptOffer } from "../controllers/formController";
import { FaBuilding, FaFilePdf, FaCheck, FaEuroSign } from "react-icons/fa";

const GetOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOffersForUser()
      .then((res) => {
        console.log("This is the response: ", res);
        setOffers(res.data?.offers || []);
      })
      .catch((err) => {
        setError(err?.error || "Failed to fetch offers");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleViewPdf = (pdfFile) => {
    console.log("pdfFile type:", typeof pdfFile, pdfFile);

    if (pdfFile && pdfFile.buffer) {
      const base64Pdf = pdfFile.buffer;
      if (base64Pdf.startsWith("JVBER")) {
        const pdfWindow = window.open();
        pdfWindow.document.write(
          `<embed src="data:application/pdf;base64,${base64Pdf}" width="100%" height="100%" />`
        );
      } else {
        alert("Invalid PDF data.");
      }
    } else {
      alert("No PDF available.");
    }
  };

  const handleAcceptOffer = async (entryId, id, emailAddress) => {
    console.log("Offer accepted:", entryId, id, emailAddress);

    try {
      const result = await acceptOffer(id, entryId, emailAddress);
      alert(result.message);

      // Update the offer status locally in the UI
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === id ? { ...offer, status: "Accepted" } : offer
        )
      );
    } catch (error) {
      alert("Failed to accept the offer. Please try again.");
      console.error("Error accepting offer:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading offers...</p>
      </div>
    );
  if (error)
    return <p className="text-red-600 text-center p-4">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Received Offers</h2>
      {offers.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No offers received yet.
        </p>
      ) : (
        <div className="space-y-4">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaBuilding className="text-blue-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      {offer.offerData?.firmName}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-4">
                    {offer.offerData?.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <FaEuroSign className="text-blue-600" />
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {offer.offerData?.price} €
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">Total price</div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
                {offer.offerData.pdfFile && (
                  <button
                    onClick={() => handleViewPdf(offer.offerData.pdfFile)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaFilePdf />
                    View Proposal
                  </button>
                )}

                {offer.status === "Accepted" ? (
                  <span className="w-full sm:w-auto px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium flex items-center justify-center gap-2">
                    <FaCheck className="text-green-600" />
                    Offer Accepted
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      handleAcceptOffer(
                        offer.entryId,
                        offer.id,
                        offer.offerData?.providerEmail
                      )
                    }
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCheck />
                    Accept Offer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetOffers;
