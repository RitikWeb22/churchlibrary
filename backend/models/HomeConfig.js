const mongoose = require("mongoose");

const homeConfigSchema = new mongoose.Schema(
    {
        mainText: { type: String, default: "Welcome to the Church Life" },
        sections: { type: Array, default: [] },
        lightBg: { type: String, default: "" },
        darkBg: { type: String, default: "" },
        bannerTitle: { type: String, default: "" },
        banner: { type: String, default: "" },
        eventCalendar: {
            pdf: { type: String, default: "" },
            banner: { type: String, default: "" },
        },
        // New field for marquee latest updates
        latestUpdates: { type: [String], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("HomeConfig", homeConfigSchema);
