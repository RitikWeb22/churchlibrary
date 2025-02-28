import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Fetch the registration configuration
export async function getRegistrationConfig() {
    try {
        const res = await axios.get(`${BASE_URL}/registration-config`);
        return res.data;
    } catch (error) {
        console.error("Error fetching registration config:", error);
        throw error;
    }
}

// Optional: Update the registration configuration
export async function updateRegistrationConfig(configData) {
    try {
        const res = await axios.put(`${BASE_URL}/registration-config`, configData);
        return res.data;
    } catch (error) {
        console.error("Error updating registration config:", error);
        throw error;
    }
}
