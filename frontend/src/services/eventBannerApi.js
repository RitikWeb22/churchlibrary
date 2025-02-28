import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Fetch Event Banner
export async function getEventBanner() {
    try {
        const res = await axios.get(`${BASE_URL}/event-banner`);
        return res.data;
    } catch (error) {
        console.error("Error fetching event banner:", error);
        throw error;
    }
}

// Update Event Banner
export async function updateEventBanner(title, imageFile) {
    try {
        const formData = new FormData();
        formData.append("title", title);
        if (imageFile) formData.append("image", imageFile);

        const res = await axios.put(`${BASE_URL}/event-banner`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data;
    } catch (error) {
        console.error("Error updating event banner:", error);
        throw error;
    }
}
