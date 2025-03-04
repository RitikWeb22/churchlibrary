// services/announcementApi.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function getCsrfToken() {
    const response = await fetch(`${BASE_URL}/csrf-token`, {
        credentials: "include",
    });
    const data = await response.json();
    return data.csrfToken;
}

// Fetch all announcements
export async function getAnnouncements() {
    try {
        const response = await fetch(`${BASE_URL}/announcements`, {
            credentials: "include",
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to fetch announcements: ${response.status} ${response.statusText} - ${errorText}`
            );
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Create new announcement (with two images possible)
export async function createAnnouncement(payload, imageFile, bannerImageFile) {
    try {
        const formData = new FormData();
        formData.append("title", payload.title);
        formData.append("description", payload.description);
        formData.append("date", payload.date || "");
        formData.append("bannerText", payload.bannerText || "");

        if (imageFile) {
            formData.append("image", imageFile);
        }
        if (bannerImageFile) {
            formData.append("bannerImage", bannerImageFile);
        }

        const csrfToken = await getCsrfToken();

        const response = await fetch(`${BASE_URL}/announcements`, {
            method: "POST",
            credentials: "include",
            headers: {
                "x-csrf-token": csrfToken,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to create announcement: ${response.status} ${response.statusText} - ${errorText}`
            );
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Update existing announcement (with two images possible)
export async function updateAnnouncement(id, payload, imageFile, bannerImageFile) {
    try {
        const formData = new FormData();
        formData.append("title", payload.title);
        formData.append("description", payload.description);
        formData.append("date", payload.date || "");
        formData.append("bannerText", payload.bannerText || "");

        if (imageFile) {
            formData.append("image", imageFile);
        }
        if (bannerImageFile) {
            formData.append("bannerImage", bannerImageFile);
        }

        const csrfToken = await getCsrfToken();

        const response = await fetch(`${BASE_URL}/announcements/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "x-csrf-token": csrfToken,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to update announcement: ${response.status} ${response.statusText} - ${errorText}`
            );
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Delete announcement
export async function deleteAnnouncement(id) {
    try {
        const csrfToken = await getCsrfToken();
        const response = await fetch(`${BASE_URL}/announcements/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "x-csrf-token": csrfToken,
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to delete announcement: ${response.status} ${response.statusText} - ${errorText}`
            );
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}
