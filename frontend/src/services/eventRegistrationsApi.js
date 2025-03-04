// services/eventRegistrationsApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper: fetch CSRF token
export const getCsrfToken = async () => {
    const { data } = await axios.get(`${API_BASE}/csrf-token`, { withCredentials: true });
    return data.csrfToken;
};

/**
 * Fetch all registrations
 * GET /api/event-registrations
 */
export async function getRegistrations() {
    try {
        const response = await axios.get(`${API_BASE}/event-registrations`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a registration by ID
 * DELETE /api/event-registrations/:id
 */
export async function deleteRegistration(regId) {
    try {
        const csrfToken = await getCsrfToken();
        const response = await axios.delete(`${API_BASE}/event-registrations/${regId}`, {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Optionally, you can add a createRegistration endpoint if needed.
