import axios from "axios";

const API_URL = "http://localhost:8000/api/user";

// Signup
export const signup = async (username, password, email, userType) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      username,
      password,
      email,
      userType,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const testConnection = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/test");
    console.log("Response is: ", response.data);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

// Confirm Signup
export const confirmSignup = async (username, confirmationCode) => {
  try {
    const response = await axios.post(`${API_URL}/confirm-signup`, {
      username,
      confirmationCode,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Sign In
export const signIn = async (username, password, userType) => {
  try {
    console.log("Received: ", { username, password, userType });
    const response = await axios.post(
      `${API_URL}/signin`,
      { username, password, userType },
      { withCredentials: true }
    );
    localStorage.setItem("userType", userType);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Logout
export const logOut = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Change Email
export const changeUserEmail = async (newEmail, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/change-user-email`,
      { newEmail },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Change Password
export const changeUserPassword = async (newPassword, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/change-user-password`,
      { newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Validate Token
export const validateToken = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/validate-token`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return { success: false };
  }
};
