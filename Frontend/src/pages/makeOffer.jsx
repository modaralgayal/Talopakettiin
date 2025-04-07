import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOfferContext } from "../context/offerContext";
import { makeOfferToUser } from "../controllers/formController";

const MakeOffer = () => {
  const { offerData, updateOfferData } = useOfferContext();
  const navigate = useNavigate();

  const [price, setPrice] = useState(offerData.price || "");
  const [firmName, setFirmName] = useState(offerData.firmName || "");
  const [description, setDescription] = useState(offerData.description || "");
  const [providerEmail, setProviderEmail] = useState(offerData.providerEmail || "");
  const [pdfFile, setPdfFile] = useState(null); // PDF file state

  useEffect(() => {
    setPrice(offerData.price || "");
    setFirmName(offerData.firmName || "");
    setDescription(offerData.description || "");
    setProviderEmail(offerData.providerEmail || "");
    console.log("This is the application we are offering to:", offerData.formData);
  }, [offerData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedOffer = {
      ...offerData,
      price,
      firmName,
      description,
      providerEmail,
    };

    updateOfferData(updatedOffer);

    console.log("Sending PDF file:", pdfFile);

    makeOfferToUser(updatedOffer, offerData.userId, offerData.entryId, pdfFile) // ✅ Pass file separately
      .then((res) => {
        console.log("Offer successfully submitted:", res);
        // Optionally reset form here
        // navigate("/confirmation");
      })
      .catch((error) => {
        console.error("Failed to submit offer:", error);
        alert("There was an error submitting your offer. Please try again.");
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
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

          {/* PDF Upload */}
          <div>
            <label className="block text-left font-medium mb-2">
              Attach PDF (optional)
            </label>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="pdfUpload"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
              >
                Browse PDF
              </label>
              {pdfFile && (
                <span className="text-sm text-green-700">{pdfFile.name}</span>
              )}
            </div>

            {/* Hidden file input */}
            <input
              id="pdfUpload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
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
