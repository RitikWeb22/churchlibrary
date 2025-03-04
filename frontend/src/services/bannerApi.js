// services/bannerApi.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function getCsrfToken() {
    const response = await fetch(`${BASE_URL}/api/csrf-token`, {
        credentials: "include",
    });
    const data = await response.json();
    return data.csrfToken;
}

// GET existing banner
export async function getBanner() {
    const response = await fetch(`${BASE_URL}/banner`, {
        credentials: "include",
    });
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
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${BASE_URL}/banner`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "x-csrf-token": csrfToken,
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error("Failed to update banner");
    }
    return await response.json();
}

// DELETE banner
export async function deleteBanner() {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${BASE_URL}/banner`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "x-csrf-token": csrfToken,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete banner");
    }
    return await response.json();
}
