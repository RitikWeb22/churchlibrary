require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const connectDB = require("./config/Database");
const cors = require("cors");

// Import routes
const bookRoutes = require("./routes/BookRoute");
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/users");
const categoriesRoutes = require("./routes/categories");
const paymentRoutes = require("./routes/paymentRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const importantLinksRoutes = require("./routes/importantLinksRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const eventBannerRoutes = require("./routes/eventBannerRoutes");
const eventFieldRoutes = require("./routes/eventFieldRoutes");
const eventRegistrationRoutes = require("./routes/eventRegistrationRoutes");
const registrationConfigRoutes = require("./routes/registrationConfigRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const calenderPurchaseRoutes = require("./routes/calendarPurchaseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const importBooks = require("./routes/BookRoute");
const contactRoutes = require("./routes/contactRoutes");
const contactBannerRoutes = require("./routes/contactBannerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const eventDetailsRoutes = require("./routes/eventDetailsRoutes");
const statsRoutes = require("./routes/statsRoutes");

// Import Stats model for real-time dashboard stats
const Stats = require("./models/Stats");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" folder (for uploaded images, PDFs, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/important-links", importantLinksRoutes);
app.use("/api/event-banner", eventBannerRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/event-fields", eventFieldRoutes);
app.use("/api/registration-config", registrationConfigRoutes);
app.use("/api/calendars", calendarRoutes);
app.use("/api/calendar-purchases", calenderPurchaseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/books/import", importBooks);
app.use("/api/contacts", contactRoutes);
app.use("/api/contact-banner", contactBannerRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/event-details", eventDetailsRoutes);
app.use("/api/stats", statsRoutes);


// Start the server using the HTTP server instance
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
