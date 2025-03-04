import axios from "axios";

// Base API URL (using Vite's env variables)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create an Axios instance with the base URL and send cookies with every request.
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ------------------------------
// Helper: Get CSRF Token
// ------------------------------
export const getCsrfToken = async () => {
  const { data } = await api.get("/csrf-token");
  return data.csrfToken;
};

// ------------------------------
// Books Endpoints
// ------------------------------
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
  const csrfToken = await getCsrfToken();
  const response = await api.post("/books", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-csrf-token": csrfToken,
    },
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
  const csrfToken = await getCsrfToken();
  const response = await api.put(`/books/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-csrf-token": csrfToken,
    },
  });
  return response.data;
};

export const deleteBook = async (id) => {
  const csrfToken = await getCsrfToken();
  const response = await api.delete(`/books/${id}`, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

// ------------------------------
// Payment & Borrow Endpoints for Books
// ------------------------------
export const purchaseBook = async (purchaseData, screenshotFile) => {
  const formData = new FormData();
  formData.append("bookId", purchaseData.bookId);
  formData.append("bookName", purchaseData.bookTitle);
  formData.append("userName", purchaseData.buyerName);
  formData.append("contactNumber", purchaseData.contact);
  formData.append("language", purchaseData.language);
  formData.append("price", purchaseData.price);
  formData.append("paymentMethod", purchaseData.paymentMethod);
  if (purchaseData.paymentMethod === "Online" && screenshotFile) {
    formData.append("screenshot", screenshotFile);
  }
  const response = await api.post("/payments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const borrowBook = async (borrowData) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/books/borrow", borrowData, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

// ------------------------------
// Categories Endpoints
// ------------------------------
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const addCategory = async (name) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/categories", { name }, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const removeCategory = async (name) => {
  const csrfToken = await getCsrfToken();
  const response = await api.delete(`/categories/${name}`, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const getBooksByCategory = async (category) => {
  const response = await api.get(`/books/category/${category}`);
  return response.data;
};

// ------------------------------
// Users & Auth Endpoints
// ------------------------------
export const getUsers = async () => {
  const response = await api.get("/auth");
  return response.data;
};

export const loginUser = async (loginData) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/auth/login", loginData, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const registerUser = async (registerData) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/auth/register", registerData, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const deleteUser = async (id) => {
  const csrfToken = await getCsrfToken();
  const response = await api.delete(`/users/${id}`, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const csrfToken = await getCsrfToken();
  const response = await api.put(`/users/${id}/role`, { role }, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const updateUser = async (id, data) => {
  const csrfToken = await getCsrfToken();
  const response = await api.put(`/users/${id}`, data, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

// ------------------------------
// OTP & Google Auth Endpoints
// ------------------------------
export const sendOTP = async (data) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/auth/send-otp", data, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const verifyOTP = async (data) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/auth/verify-otp", data, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const googleSignIn = async (googleData) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/auth/google", googleData, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

// ------------------------------
// File Upload
// ------------------------------
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const csrfToken = await getCsrfToken();
  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-csrf-token": csrfToken,
    },
  });
  return response.data;
};

// ------------------------------
// Import Books
// ------------------------------
export const importBooks = async (books) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/books/import", books, {
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,
    },
  });
  return response.data;
};

// ------------------------------
// Announcements & Event Registrations
// ------------------------------
export const createAnnouncement = async (payload, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("date", payload.date);
    formData.append("link", payload.link);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const csrfToken = await getCsrfToken();
    const response = await api.post("/announcements", formData, {
      headers: { "x-csrf-token": csrfToken },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function createRegistration(regData) {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/event-registrations", regData, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
}

export const getRegistrations = async () => {
  const response = await api.get("/event-registrations");
  return response.data;
};

export const deleteRegistration = async (id) => {
  const csrfToken = await getCsrfToken();
  const response = await api.delete(`/event-registrations/${id}`, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

// ------------------------------
// Church Calendar Endpoints
// ------------------------------
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
  const csrfToken = await getCsrfToken();
  const response = await api.post("/calendars", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-csrf-token": csrfToken,
    },
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
  const csrfToken = await getCsrfToken();
  const response = await api.put(`/calendars/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-csrf-token": csrfToken,
    },
  });
  return response.data;
};

export const deleteCalendar = async (id) => {
  const csrfToken = await getCsrfToken();
  const response = await api.delete(`/calendars/${id}`, {
    headers: { "x-csrf-token": csrfToken },
  });
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
  const csrfToken = await getCsrfToken();
  const response = await api.post("/calendar-purchases", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-csrf-token": csrfToken,
    },
  });
  return response.data;
};

export const getPurchases = async () => {
  const response = await api.get("/calendar-purchases");
  return response.data;
};

// ------------------------------
// Contact Endpoints
// ------------------------------
export const createContact = async (contactData) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/contacts", contactData, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const getContacts = async () => {
  const response = await api.get("/contacts");
  return response.data;
};

// ------------------------------
// Contact Banner Endpoints
// ------------------------------
export const getContactBanner = async () => {
  const response = await api.get("/contact-banner");
  return response.data;
};

export const uploadContactBanner = async (bannerFile) => {
  const formData = new FormData();
  formData.append("banner", bannerFile);
  const csrfToken = await getCsrfToken();
  const response = await api.post("/contact-banner", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-csrf-token": csrfToken,
    },
  });
  return response.data;
};

// ------------------------------
// Home Page Config Endpoints
// ------------------------------
export const getHomeConfig = async () => {
  const response = await api.get("/home");
  return response.data;
};

export const updateHomeConfig = async (data, files) => {
  const formData = new FormData();
  if (data.mainText) formData.append("mainText", data.mainText);
  if (data.sections) formData.append("sections", JSON.stringify(data.sections));
  if (data.bannerTitle) formData.append("bannerTitle", data.bannerTitle);
  if (files.banner) formData.append("banner", files.banner);
  if (files.lightBg) formData.append("lightBg", files.lightBg);
  if (files.darkBg) formData.append("darkBg", files.darkBg);
  if (files.eventCalendarPdf) formData.append("eventCalendarPdf", files.eventCalendarPdf);
  if (files.eventCalendarBanner) formData.append("eventCalendarBanner", files.eventCalendarBanner);

  const csrfToken = await getCsrfToken();
  const response = await api.put("/home", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-csrf-token": csrfToken,
    },
  });
  return response.data;
};

// ------------------------------
// Phone-based Verification
// ------------------------------
export const checkNumberExists = async (phone) => {
  try {
    const csrfToken = await getCsrfToken();
    await api.post("/auth/verify-phone", { phone }, {
      headers: { "x-csrf-token": csrfToken },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const updatePassword = async (phoneNumber, newPassword) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post(
    "/auth/reset-password",
    { phone: phoneNumber, newPassword },
    { headers: { "x-csrf-token": csrfToken } }
  );
  return response.data;
};

export const createUser = async (userData) => {
  const csrfToken = await getCsrfToken();
  const res = await api.post("/auth/create-user", userData, {
    headers: { "x-csrf-token": csrfToken },
  });
  return res.data;
};

// ------------------------------
// Dynamic Form Fields (Event Fields) Endpoints
// ------------------------------
export const getFormFields = async () => {
  const response = await api.get("/event-fields");
  return response.data;
};

export const createFormField = async (fieldData) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/event-fields", fieldData, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const updateFormField = async (id, fieldData) => {
  const csrfToken = await getCsrfToken();
  const response = await api.put(`/event-fields/${id}`, fieldData, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const deleteFormField = async (id) => {
  const csrfToken = await getCsrfToken();
  const response = await api.delete(`/event-fields/${id}`, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export const updateFieldOrder = async (orderArray) => {
  const csrfToken = await getCsrfToken();
  const response = await api.put("/event-fields/order", orderArray, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

// ------------------------------
// Import Users (Excel) Endpoints
// ------------------------------
export const importUsers = async (file, token) => {
  const formData = new FormData();
  formData.append("excel", file);

  const csrfToken = await getCsrfToken();
  const response = await api.post("/auth/import-users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
      "x-csrf-token": csrfToken,
    },
  });
  return response.data;
};

// ------------------------------
// New: Add Phone Number (Admin Pre-Populate)
// ------------------------------
export const addPhoneNumber = async (phoneData, token) => {
  const csrfToken = await getCsrfToken();
  const response = await api.post("/auth/add-phone", phoneData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-csrf-token": csrfToken,
    },
  });
  return response.data;
};

// ------------------------------
// Stats Endpoints
// ------------------------------
export const getStats = async () => {
  const response = await api.get("/stats");
  return response.data;
};

export const updateStats = async (statsData) => {
  const csrfToken = await getCsrfToken();
  const response = await api.put("/stats", statsData, {
    headers: { "x-csrf-token": csrfToken },
  });
  return response.data;
};

export default api;
