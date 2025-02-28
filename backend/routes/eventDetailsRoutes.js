// routes/eventDetailsRoutes.js
const express = require("express");
const router = express.Router();
const HomeConfig = require("../models/HomeConfig");

// If your static files are served at http://localhost:5000/uploads,
// define a base URL for partial paths:
const SERVER_BASE_URL = process.env.SERVER_BASE_URL || "http://localhost:5000";

router.get("/", async (req, res) => {
    try {
        const config = await HomeConfig.findOne();
        if (!config || !config.eventCalendar) {
            return res.status(404).json({ message: "Event details not found" });
        }

        // Extract the PDF and banner paths from the DB
        const pdfPath = config.eventCalendar.pdf || "";
        const bannerPath = config.eventCalendar.banner || "";

        // If your DB just stores "uploads/my.pdf" or "/uploads/my.pdf",
        // prepend SERVER_BASE_URL if needed
        const pdfUrl =
            pdfPath.startsWith("http") || pdfPath.startsWith("/")
                ? pdfPath
                : SERVER_BASE_URL + "/" + pdfPath;

        const bannerUrl =
            bannerPath.startsWith("http") || bannerPath.startsWith("/")
                ? bannerPath
                : SERVER_BASE_URL + "/" + bannerPath;

        res.json({
            pdfUrl,
            bannerUrl,
        });
    } catch (error) {
        console.error("Error fetching event details:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
