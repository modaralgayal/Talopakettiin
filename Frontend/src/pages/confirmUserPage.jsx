import React, { useState } from "react";
import { confirmSignup } from "../controllers/userController";

export const ConfirmUser = () => {
  const [username, setUsername] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000); // Auto-hide after 5 seconds
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    try {
      const response = await confirmSignup(username, confirmationCode);
      showMessage(
        response.message || "User confirmed successfully!",
        "success"
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.error || "Confirmation failed.";
      showMessage(errorMessage, "error");
    }
  };

  const containerClass =
    "min-h-screen flex items-center justify-center bg-gray-100";
  const cardClass = "w-full max-w-md p-6 bg-white rounded-xl shadow-md";
  const titleClass = "text-2xl font-semibold mb-6 text-center";
  const labelClass = "block text-gray-700";
  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonClass =
    "w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition";
  const messageClass =
    messageType === "error" ? "text-red-600" : "text-green-600";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <h1 className={titleClass}>Confirm Your Account</h1>
        <form className="space-y-4" onSubmit={handleConfirm}>
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              className={inputClass}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className={labelClass}>Confirmation Code</label>
            <input
              type="text"
              className={inputClass}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Enter the code sent to your email"
            />
          </div>

          {/* 🚀 Message Box (Appears only when there's a message) */}
          {message && (
            <p className={`text-center font-medium ${messageClass}`}>
              {message}
            </p>
          )}

          <button type="submit" className={buttonClass}>
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};
