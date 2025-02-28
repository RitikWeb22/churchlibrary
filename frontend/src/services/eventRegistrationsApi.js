// services/eventRegistrationsApi.js
import axios from "axios";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Fetch all registrations
 * GET /api/event-registrations
 */
export async function getRegistrations() {
    try {
        const response = await axios.get(`${API_BASE}/event-registrations`);
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
        const response = await axios.delete(`${API_BASE}/event-registrations/${regId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Optionally, if you want to create a registration from here:
 * POST /api/event-registrations
 */
// export async function createRegistration(regData) {
//   try {
//     const response = await axios.post(`${API_BASE}/event-registrations`, regData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }
