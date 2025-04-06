import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOfferContext } from "../context/offerContext";

const MakeOffer = () => {
  const { offerData, updateOfferData } = useOfferContext(); // Access offer data from context
  const navigate = useNavigate();

  // Initialize state from the offerData
  const [price, setPrice] = useState(offerData.price || ""); // Default value if offerData is empty
  const [firmName, setFirmName] = useState(offerData.firmName || "");
  const [description, setDescription] = useState(offerData.description || "");
  const [providerEmail, setProviderEmail] = useState(offerData.providerEmail || "");

  // Update offer data only when values change (not on every render)
  useEffect(() => {
    // Set initial offer data when the component first loads
    setPrice(offerData.price || "");
    setFirmName(offerData.firmName || "");
    setDescription(offerData.description || "");
    setProviderEmail(offerData.providerEmail || "");
    console.log("This is the application we are offering to: ", offerData.formData)
  }, [offerData]);

  // Update context data when the local form state changes
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle offer submission logic (you could send data to an API, etc.)
    console.log("Offer submitted:", { price, firmName, description, providerEmail });

    // Update the context with the new offer data
    updateOfferData({
      ...offerData,
      price,
      firmName,
      description,
      providerEmail,
    });

    // Optionally navigate to a confirmation page or reset the context
    navigate("/confirmation"); // Example of redirecting after submission
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-6">
          Make an Offer for Entry {offerData.entryId}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Price Input */}
          <div>
            <label htmlFor="price" className="block text-left font-medium mb-2">
              Price
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter price"
              required
            />
          </div>

          {/* Firm Name Input */}
          <div>
            <label htmlFor="firmName" className="block text-left font-medium mb-2">
              Firm Name
            </label>
            <input
              id="firmName"
              type="text"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter firm name"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-left font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter description"
              rows="4"
              required
            />
          </div>

          {/* Provider Email Input */}
          <div>
            <label htmlFor="providerEmail" className="block text-left font-medium mb-2">
              Provider Email
            </label>
            <input
              id="providerEmail"
              type="email"
              value={providerEmail}
              onChange={(e) => setProviderEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Offer
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeOffer;
