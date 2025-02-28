const mongoose = require("mongoose");

const EventBannerSchema = new mongoose.Schema(
    {
        title: { type: String, default: "" }, // Default to empty string
        image: { type: String, default: "" }, // Store image URL
    },
    { timestamps: true }
);

module.exports = mongoose.model("EventBanner", EventBannerSchema);
