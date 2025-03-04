// services/eventFieldsApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper: fetch CSRF token
export const getCsrfToken = async () => {
    const { data } = await axios.get(`${API_BASE}/csrf-token`, { withCredentials: true });
    return data.csrfToken;
};

/**
 * Fetch all form fields
 * GET /api/event-fields
 */
export async function getFormFields() {
    try {
        const response = await axios.get(`${API_BASE}/event-fields`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Create a new form field
 * POST /api/event-fields
 * fieldData = { label, type, options: [] }
 */
export async function createFormField(fieldData) {
    try {
        const csrfToken = await getCsrfToken();
        const response = await axios.post(`${API_BASE}/event-fields`, fieldData, {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Update an existing form field
 * PUT /api/event-fields/:id
 * fieldData = { label, type, options: [] }
 */
export async function updateFormField(fieldId, fieldData) {
    try {
        const csrfToken = await getCsrfToken();
        const response = await axios.put(`${API_BASE}/event-fields/${fieldId}`, fieldData, {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Delete a form field
 * DELETE /api/event-fields/:id
 */
export async function deleteFormField(fieldId) {
    try {
        const csrfToken = await getCsrfToken();
        const response = await axios.delete(`${API_BASE}/event-fields/${fieldId}`, {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

/**
 * Update dynamic field ordering
 * PUT /api/event-fields/order
 */
export async function updateDynamicFieldOrdering(orderArray) {
    try {
        const csrfToken = await getCsrfToken();
        const response = await axios.put(`${API_BASE}/event-fields/order`, orderArray, {
            headers: { "x-csrf-token": csrfToken },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
