// services/registrationConfigApi.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Helper: fetch CSRF token
export const getCsrfToken = async () => {
    const { data } = await axios.get(`${BASE_URL}/csrf-token`, { withCredentials: true });
    return data.csrfToken;
};

// Fetch the registration configuration
export async function getRegistrationConfig() {
    try {
        const response = await axios.get(`${BASE_URL}/registration-config`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Update the registration configuration
export async function updateRegistrationConfig(configData) {
    try {
        const csrfToken = await getCsrfToken();
        const res = await axios.put(`${BASE_URL}/registration-config`, configData, {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}
