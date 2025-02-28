import axios from "axios";

// Base API URL (using Vite's env variables)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ------------------ Books Endpoints ------------------
export const getBooks = async () => {
  const response = await api.get("/books");
  return response.data;
};

export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export async function createBook(bookData, images) {
  const formData = new FormData();
  formData.append("title", bookData.title);
  formData.append("category", bookData.category);
  formData.append("description", bookData.description);
  formData.append("price", bookData.price);
  formData.append("stock", bookData.stock);
  if (images && images.length > 0) {
    images.forEach((imgFile) => {
      formData.append("images", imgFile);
    });
  }
  const response = await api.post("/books", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export const updateBook = async (id, bookData, images) => {
  const formData = new FormData();
  Object.keys(bookData).forEach((key) => {
    formData.append(key, bookData[key]);
  });
  if (images && images.length) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }
  const response = await api.put(`/books/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

// ------------------ Categories Endpoints ------------------
// Example snippet in services/api.js



export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const addCategory = async (name) => {
  // POST /categories with { name }
  const response = await api.post("/categories", { name });
  return response.data;
};

export const removeCategory = async (name) => {
  // Adjust if your backend expects an ID or different route
  const response = await api.delete(`/categories/${name}`);
  return response.data;
};


export const getBooksByCategory = async (category) => {
  const response = await api.get(`/books/category/${category}`);
  return response.data;
};

// ------------------ Users & Auth Endpoints ------------------
export const getUsers = async () => {
  const response = await api.get("/auth");
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

export const registerUser = async (registerData) => {
  const response = await api.post("/auth/register", registerData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.put(`/users/${id}/role`, { role });
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

// ------------------ OTP & Google Auth Endpoints ------------------
export const sendOTP = async (data) => {
  const response = await api.post("/auth/send-otp", data);
  return response.data;
};

export const verifyOTP = async (data) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

export const googleSignIn = async (googleData) => {
  const response = await api.post("/auth/google", googleData);
  return response.data;
};

// ------------------ File Upload ------------------
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ------------------ Import Books ------------------
export const importBooks = async (books) => {
  const response = await api.post("/books/import", books, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// ------------------ Announcements & Event Registrations ------------------
export async function createAnnouncement(payload, imageFile) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("date", payload.date || "");
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const response = await api.post("/announcements", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function createRegistration(regData) {
  const response = await api.post("/event-registrations", regData);
  return response.data;
}

export const getRegistrations = async () => {
  const response = await api.get("/event-registrations");
  return response.data;
};

export const deleteRegistration = async (id) => {
  const response = await api.delete(`/event-registrations/${id}`);
  return response.data;
};

// ------------------ Church Calendar Endpoints ------------------
export const getChurchCalendars = async () => {
  const response = await api.get("/calendars");
  return response.data;
};

export const createCalendar = async (calendarData, imageFile) => {
  const formData = new FormData();
  formData.append("title", calendarData.title);
  formData.append("date", calendarData.date);
  formData.append("price", calendarData.price);
  formData.append("isBanner", calendarData.isBanner || false);
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const response = await api.post("/calendars", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateCalendar = async (id, calendarData, imageFile) => {
  const formData = new FormData();
  formData.append("title", calendarData.title);
  formData.append("date", calendarData.date);
  formData.append("price", calendarData.price);
  formData.append("isBanner", calendarData.isBanner || false);
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const response = await api.put(`/calendars/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCalendar = async (id) => {
  const response = await api.delete(`/calendars/${id}`);
  return response.data;
};

export const purchaseCalendar = async (purchaseData, screenshotFile) => {
  const formData = new FormData();
  formData.append("calendarId", purchaseData.calendarId);
  formData.append("calendarTitle", purchaseData.calendarTitle);
  formData.append("purchaserName", purchaseData.purchaserName);
  formData.append("contact", purchaseData.contact);
  formData.append("price", purchaseData.price);
  formData.append("paymentMethod", purchaseData.paymentMethod);
  if (purchaseData.paymentMethod === "Online") {
    formData.append("collectorName", purchaseData.collectorName);
    if (screenshotFile) {
      formData.append("screenshot", screenshotFile);
    }
  }
  const response = await api.post("/calendar-purchases", formData);
  return response.data;
};

export const getPurchases = async () => {
  const response = await api.get("/calendar-purchases");
  return response.data;
};

// ------------------ Contact Endpoints ------------------
export const createContact = async (contactData) => {
  const response = await api.post("/contacts", contactData);
  return response.data;
};

export const getContacts = async () => {
  const response = await api.get("/contacts");
  return response.data;
};

// ------------------ Contact Banner Endpoints ------------------
export const getContactBanner = async () => {
  const response = await api.get("/contact-banner");
  return response.data;
};

export const uploadContactBanner = async (bannerFile) => {
  const formData = new FormData();
  formData.append("banner", bannerFile);
  const response = await api.post("/contact-banner", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ------------------ Home Page Config ------------------
// GET home page configuration
export const getHomeConfig = async () => {
  const response = await api.get("/home");
  return response.data;
};

// UPDATE home page configuration (including event calendar files and home banner)
export const updateHomeConfig = async (data, files) => {
  const formData = new FormData();
  if (data.mainText) formData.append("mainText", data.mainText);
  if (data.sections) formData.append("sections", JSON.stringify(data.sections));
  if (data.bannerTitle) formData.append("bannerTitle", data.bannerTitle);
  if (files.banner) formData.append("banner", files.banner);
  if (files.lightBg) formData.append("lightBg", files.lightBg);
  if (files.darkBg) formData.append("darkBg", files.darkBg);
  if (files.eventCalendarPdf)
    formData.append("eventCalendarPdf", files.eventCalendarPdf);
  if (files.eventCalendarBanner)
    formData.append("eventCalendarBanner", files.eventCalendarBanner);

  const response = await api.put("/home", formData);
  return response.data;
};

// ------------------ Phone-based Verification ------------------
export const checkNumberExists = async (phone) => {
  try {
    await api.post("/auth/verify-phone", { phone });
    return true;
  } catch (error) {
    return false;
  }
};

export const updatePassword = async (phoneNumber, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    phone: phoneNumber,
    newPassword,
  });
  return response.data;
};

export const createUser = async (userData) => {
  const res = await api.post("/auth/create-user", userData);
  return res.data;
};

// ------------------ Dynamic Form Fields (Event Fields) ------------------
export const getFormFields = async () => {
  const response = await api.get("/event-fields");
  return response.data;
};

export const createFormField = async (fieldData) => {
  const response = await api.post("/event-fields", fieldData);
  return response.data;
};

export const updateFormField = async (id, fieldData) => {
  const response = await api.put(`/event-fields/${id}`, fieldData);
  return response.data;
};

export const deleteFormField = async (id) => {
  const response = await api.delete(`/event-fields/${id}`);
  return response.data;
};

export const updateFieldOrder = async (orderArray) => {
  const response = await api.put("/event-fields/order", orderArray);
  return response.data;
};

// ------------------ Import Users (Excel) ------------------
export const importUsers = async (file, token) => {
  const formData = new FormData();
  formData.append("excel", file);

  // Must include Authorization header for protected routes
  const response = await api.post("/auth/import-users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ------------------ New: Add Phone Number (Admin Pre-Populate) ------------------
export const addPhoneNumber = async (phoneData, token) => {
  const response = await api.post("/auth/add-phone", phoneData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ------------------ Stats Endpoints ------------------
/**
 * GET stats
 * Fetch the existing stats document (or 404 if none found)
 */
export const getStats = async () => {
  const response = await api.get("/stats");
  return response.data;
};

/**
 * PUT stats
 * Update or create the stats document
 * Example usage:
 *   updateStats({ totalUsers: 10, totalEvents: 2 });
 */
export const updateStats = async (statsData) => {
  const response = await api.put("/stats", statsData);
  return response.data;
};

export default api;
