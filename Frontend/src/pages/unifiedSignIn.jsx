import React, { useState } from "react";
import { signIn, signup } from "../controllers/userController";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBuilding } from "react-icons/fa";

export const UnifiedSignIn = ({ setUserType }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [selectedUserType, setSelectedUserType] = useState(null);
  const navigate = useNavigate();

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    if (!selectedUserType) {
      showMessage("Please select your user type", "error");
      return;
    }

    try {
      const response = await signIn(username, password, selectedUserType);
      showMessage(response.message, "success");
      setUserType(selectedUserType);
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : error.error || "Sign-in failed.";
      showMessage(errorMessage, "error");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!selectedUserType) {
      showMessage("Please select your user type", "error");
      return;
    }

    if (password !== confirm) {
      showMessage("The passwords do not match. Try again.", "error");
      return;
    }

    try {
      const response = await signup(username, password, email, selectedUserType);
      showMessage("User Registered Successfully!", "success");
      setUserType(selectedUserType);
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.error || "Registration failed.";
      showMessage(errorMessage, "error");
    }
  };

  const handleGoToConfirmUser = () => {
    navigate("/confirmuser");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegister ? "Rekisteröidy" : "Kirjaudu sisään"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegister
              ? "Luo uusi tili jatkaaksesi"
              : "Kirjaudu sisään jatkaaksesi"}
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelectedUserType("customer")}
            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
              selectedUserType === "customer"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <FaUser className="w-6 h-6 mr-2 text-blue-500" />
            <span className="font-medium">Hakija</span>
          </button>
          <button
            onClick={() => setSelectedUserType("provider")}
            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
              selectedUserType === "provider"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <FaBuilding className="w-6 h-6 mr-2 text-blue-500" />
            <span className="font-medium">Toimittaja</span>
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isRegister ? handleRegister : handleSignIn}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Käyttäjänimi
              </label>
              <input
                id="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Syötä käyttäjänimi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {isRegister && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Sähköposti
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Syötä sähköposti"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Salasana
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Syötä salasana"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegister && (
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                  Vahvista salasana
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Vahvista salasana"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            )}
          </div>

          {message && (
            <div
              className={`rounded-md p-4 ${
                messageType === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isRegister ? "Rekisteröidy" : "Kirjaudu sisään"}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {isRegister
              ? "Onko sinulla jo tili? Kirjaudu sisään"
              : "Ei tiliä? Rekisteröidy"}
          </button>
          <button
            onClick={handleGoToConfirmUser}
            className="text-sm text-green-600 hover:text-green-500"
          >
            Vahvista käyttäjä
          </button>
        </div>
      </div>
    </div>
  );
}; 