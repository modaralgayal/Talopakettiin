import axios from "axios";

const API_URL = "http://localhost:8000/api/forms";

// Send Form Data
export const sendFormData = async (formData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/receive-form-data`,
      formData,
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

// Get User Forms
export const getUserForms = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/get-user-forms`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete User Entry
export const deleteUserEntry = async (entryId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/delete-user-entry`,
      { entryId },
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

// Get All Entries
export const getAllEntries = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/get-all-entries`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get User Offers
export const getUserOffers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/get-user-offers`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Accept Given Offer
export const acceptOffer = async (offerId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/accept-given-offer`,
      { offerId },
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
