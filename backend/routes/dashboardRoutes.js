const express = require("express");
const router = express.Router();
const Stats = require("../models/Stats");

// GET /api/dashboard/stats
router.get("/stats", async (req, res) => {
  try {
    const statsData = await Stats.findOne();
    if (!statsData) {
      // If no stats document exists, return default values
      return res.json({
        totalUsers: 0,
        totalEvents: 0,
        totalPurchases: 0,
        totalAnnouncements: 0,
      });
    }
    res.json(statsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
