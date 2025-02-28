// routes/statsRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/EventRegistration");
const Purchase = require("../models/Payment");
const Announcement = require("../models/Announcement");

// GET /api/stats - aggregate counts from different collections
router.get("/", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalPurchases = await Purchase.countDocuments();
        const totalAnnouncements = await Announcement.countDocuments();

        res.json({ totalUsers, totalEvents, totalPurchases, totalAnnouncements });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
