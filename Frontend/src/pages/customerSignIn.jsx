import React, { useState } from "react";
import { signIn, signup } from "../controllers/userController";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export const CustomerSignIn = ({ setUserType }) => { // Accept setUserType as a prop
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const userType = "customer"; // fixed to customer
  const navigate = useNavigate(); // Initialize useNavigate

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000); // Hide after 5s
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await signIn(username, password, userType);
      showMessage(response.message, "success");
      setUserType("customer"); // Set userType in App state
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : error.error || "Sign-in failed.";
      showMessage(errorMessage, "error");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirm) {
      showMessage("The passwords do not match. Try again.", "error");
      return;
    }

    try {
      const response = await signup(username, password, email, userType);
      showMessage("User Registered Successfully!", "success");
      setUserType("customer"); // Set userType in App state
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.error || "Registration failed.";
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
  const toggleClass =
    "mt-4 text-center text-blue-500 hover:underline cursor-pointer";
  const messageClass =
    messageType === "error" ? "text-red-600" : "text-green-600";

  // Navigate to '/confirmuser'
  const handleGoToConfirmUser = () => {
    navigate("/confirmuser");
  };

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <h1 className={titleClass}>{isRegister ? "Register" : "Sign In"}</h1>
        <form
          className="space-y-4"
          onSubmit={isRegister ? handleRegister : handleSignIn}
        >
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              className={inputClass}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          {isRegister && (
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                className={inputClass}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          )}
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {isRegister && (
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input
                type="password"
                className={inputClass}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
          )}

          {/* 🚀 Message Box (Appears only when there's a message) */}
          {message && (
            <p
              className={`text-center text-xl font-medium ${messageClass} border-2`}
            >
              {message}
            </p>
          )}

          <button type="submit" className={buttonClass}>
            {isRegister ? "Register" : "Sign In"}
          </button>
        </form>
        <div className={toggleClass} onClick={() => setIsRegister(!isRegister)}>
          {isRegister
            ? "Already have an account? Sign in here"
            : "Not a user? Register here"}
        </div>
        {/* Button to go to /confirmuser */}
        <div className="mt-4 text-center">
          <button
            onClick={handleGoToConfirmUser}
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
          >
            Confirm Your User Here!
          </button>
        </div>
      </div>
    </div>
  );
};
