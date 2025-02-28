// models/Stats.js
const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema(
    {
        totalUsers: { type: Number, default: 0 },
        totalEvents: { type: Number, default: 0 },
        totalPurchases: { type: Number, default: 0 },
        totalAnnouncements: { type: Number, default: 0 },
    },
    {
        timestamps: true, // automatically creates createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("Stats", StatsSchema);
