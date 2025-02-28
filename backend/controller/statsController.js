const Stats = require("../models/Stats");

/**
 * GET /api/stats
 * Fetch the existing stats document
 */
exports.getStats = async (req, res) => {
    try {
        // Attempt to find the first (or only) Stats document
        const stats = await Stats.findOne();

        if (!stats) {
            return res.status(404).json({ message: "No stats document found." });
        }

        res.json(stats);
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * PUT /api/stats
 * Update (or create) the stats document
 */
exports.updateStats = async (req, res) => {
    try {
        // Find the first stats doc; if none, create a new one
        let stats = await Stats.findOne();
        if (!stats) {
            stats = new Stats();
        }

        // Update only the fields sent in the request body
        if (req.body.totalUsers !== undefined) {
            stats.totalUsers = req.body.totalUsers;
        }
        if (req.body.totalEvents !== undefined) {
            stats.totalEvents = req.body.totalEvents;
        }
        if (req.body.totalPurchases !== undefined) {
            stats.totalPurchases = req.body.totalPurchases;
        }
        if (req.body.totalAnnouncements !== undefined) {
            stats.totalAnnouncements = req.body.totalAnnouncements;
        }

        await stats.save();
        res.json({ message: "Stats updated successfully", stats });
    } catch (error) {
        console.error("Error updating stats:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
