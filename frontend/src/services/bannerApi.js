// services/bannerApi.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// GET existing banner
export async function getBanner() {
    const response = await fetch(`${BASE_URL}/banner`);
    if (!response.ok) {
        throw new Error("Failed to fetch banner");
    }
    return await response.json();
}

// UPDATE banner (with image)
export async function updateBanner(title, bannerImageFile) {
    const formData = new FormData();
    formData.append("title", title);
    if (bannerImageFile) {
        formData.append("image", bannerImageFile);
    }

    const response = await fetch(`${BASE_URL}/banner`, {
        method: "PUT",
        body: formData,
    });
    if (!response.ok) {
        throw new Error("Failed to update banner");
    }
    return await response.json();
}

// DELETE banner
export async function deleteBanner() {
    const response = await fetch(`${BASE_URL}/banner`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete banner");
    }
    return await response.json();
}
