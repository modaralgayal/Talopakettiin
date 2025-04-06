import axios from "axios";

const API_URL = "http://localhost:8000/api/forms";

// Send Form Data
export const sendFormData = async (formData) => {
  console.log("Received formData: ", formData);
  try {
    const response = await axios.post(
      `${API_URL}/receive-form-data`,
      formData,
      {
        withCredentials: true, // Send cookies automatically
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get User Forms
export const getUserForms = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-user-forms`, {
      withCredentials: true, // Send cookies automatically
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete User Entry
export const deleteUserEntry = async (entryId) => {
  try {
    const response = await axios.post(
      `${API_URL}/delete-user-entry`,
      { entryId },
      {
        withCredentials: true, // Send cookies automatically
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get All Entries
export const getAllEntries = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-all-entries`, {
      withCredentials: true, // Send cookies automatically
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get User Offers
export const getUserOffers = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-user-offers`, {
      withCredentials: true, // Send cookies automatically
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Accept Given Offer
export const acceptOffer = async (offerId) => {
  try {
    const response = await axios.put(
      `${API_URL}/accept-given-offer`,
      { offerId },
      {
        withCredentials: true, // Send cookies automatically
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Make Offer to User (assuming offerId is passed)
export const makeOfferToUser = async (offerData, userId, entryId) => {
  try {
    const response = await axios.post(
      `${API_URL}/make-offer`, // The endpoint to create the offer (adjust the path as needed)
      { offerData, userId, entryId },
      {
        withCredentials: true, // Send cookies automatically
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
