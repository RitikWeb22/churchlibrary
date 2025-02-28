// services/importantLinksApi.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// GET all important links
export async function getImportantLinks() {
    const response = await fetch(`${BASE_URL}/important-links`);
    if (!response.ok) {
        throw new Error("Failed to fetch important links");
    }
    return await response.json();
}

// CREATE a new link
export async function createImportantLink(payload) {
    // payload = { title, url }
    const response = await fetch(`${BASE_URL}/important-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error("Failed to create link");
    }
    return await response.json();
}

// UPDATE an existing link
export async function updateImportantLink(id, payload) {
    // payload = { title, url }
    const response = await fetch(`${BASE_URL}/important-links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error("Failed to update link");
    }
    return await response.json();
}

// DELETE a link
export async function deleteImportantLink(id) {
    const response = await fetch(`${BASE_URL}/important-links/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete link");
    }
    return await response.json();
}
