// services/importantLinksApi.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Helper: fetch CSRF token using fetch API
export async function getCsrfToken() {
    const response = await fetch(`${BASE_URL}/csrf-token`, { credentials: "include" });
    if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
    }
    const data = await response.json();
    return data.csrfToken;
}

// GET all important links
export async function getImportantLinks() {
    const response = await fetch(`${BASE_URL}/important-links`, { credentials: "include" });
    if (!response.ok) {
        throw new Error("Failed to fetch important links");
    }
    return await response.json();
}

// CREATE a new link
export async function createImportantLink(payload) {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${BASE_URL}/important-links`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error("Failed to create link");
    }
    return await response.json();
}

// UPDATE an existing link
export async function updateImportantLink(id, payload) {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${BASE_URL}/important-links/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error("Failed to update link");
    }
    return await response.json();
}

// DELETE a link
export async function deleteImportantLink(id) {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`${BASE_URL}/important-links/${id}`, {
        method: "DELETE",
        headers: { "x-csrf-token": csrfToken },
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Failed to delete link");
    }
    return await response.json();
}
