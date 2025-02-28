// services/eventFieldsApi.js
import axios from "axios";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Fetch all form fields
 * GET /api/event-fields
 */
export async function getFormFields() {
    try {
        const response = await axios.get(`${API_BASE}/event-fields`);
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
        const response = await axios.post(`${API_BASE}/event-fields`, fieldData);
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
        const response = await axios.put(
            `${API_BASE}/event-fields/${fieldId}`,
            fieldData
        );
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
        const response = await axios.delete(`${API_BASE}/event-fields/${fieldId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateDynamicFieldOrdering(orderArray) {
    try {
        const response = await axios.put(`${API_BASE}/event-fields/order`, orderArray);
        return response.data;
    } catch (error) {
        console.error("Error updating dynamic field ordering:", error);
        throw error;
    }
}
