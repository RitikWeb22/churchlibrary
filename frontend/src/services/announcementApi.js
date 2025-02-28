// services/announcementApi.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Fetch all announcements
export async function getAnnouncements() {
    const response = await fetch(`${BASE_URL}/announcements`);
    if (!response.ok) {
        throw new Error("Failed to fetch announcements");
    }
    return await response.json();
}

// Create new announcement (with two images possible)
export async function createAnnouncement(payload, imageFile, bannerImageFile) {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("date", payload.date || "");
    formData.append("bannerText", payload.bannerText || "");

    // If user selected a main image
    if (imageFile) {
        formData.append("image", imageFile);
    }
    // If user selected a banner image
    if (bannerImageFile) {
        formData.append("bannerImage", bannerImageFile);
    }

    const response = await fetch(`${BASE_URL}/announcements`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        throw new Error("Failed to create announcement");
    }
    return await response.json();
}

// Update existing announcement (two images possible)
export async function updateAnnouncement(id, payload, imageFile, bannerImageFile) {
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

    const response = await fetch(`${BASE_URL}/announcements/${id}`, {
        method: "PUT",
        body: formData,
    });
    if (!response.ok) {
        throw new Error("Failed to update announcement");
    }
    return await response.json();
}

// Delete announcement
export async function deleteAnnouncement(id) {
    const response = await fetch(`${BASE_URL}/announcements/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete announcement");
    }
    return await response.json();
}
