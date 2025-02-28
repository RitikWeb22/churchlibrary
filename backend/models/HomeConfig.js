const mongoose = require("mongoose");

const homeConfigSchema = new mongoose.Schema(
    {
        mainText: { type: String, default: "Welcome to the Church Life" },
        sections: { type: Array, default: [] },
        lightBg: { type: String, default: "" },
        darkBg: { type: String, default: "" },
        // New fields for home page banner
        bannerTitle: { type: String, default: "" },
        banner: { type: String, default: "" },
        // Event calendar configuration
        eventCalendar: {
            pdf: { type: String, default: "" },
            banner: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("HomeConfig", homeConfigSchema);
