require("dotenv").config();

// Validate critical environment variables
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}
if (!process.env.PEPPER) {
  console.error("FATAL ERROR: PEPPER is not defined.");
  process.exit(1);
}

const express = require("express");
const path = require("path");
const connectDB = require("./config/Database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const helmet = require("helmet");

// Import routes
const bookRoutes = require("./routes/BookRoute");
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/users");
const categoriesRoutes = require("./routes/categories");
const paymentRoutes = require("./routes/paymentRoutes"); // Payments route
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

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Standard middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(helmet());

// Configure Helmet’s Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameAncestors: ["'self'", "http://localhost:5173"],
      },
    },
  })
);

// ── Mount payments route BEFORE CSRF protection ─────────────────────────────
app.use("/api/payments", paymentRoutes);

// ── Set up CSRF protection for all subsequent routes ──────────────────────────
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});

// Endpoint to provide CSRF token to the client
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Apply CSRF protection to all routes below this point
app.use(csrfProtection);

// Serve static files from the "uploads" folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath, stat) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    },
  })
);

// ── Mount other routes ─────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes);
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
app.use("/api/event-details", eventDetailsRoutes);
app.use("/api/stats", statsRoutes);

// ── CSRF error handler ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  res.status(403).json({ message: "Invalid CSRF token" });
});

// ── General error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: "An unexpected error occurred. Please try again later."
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
