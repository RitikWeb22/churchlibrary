// models/Banner.js
const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
    {
        title: { type: String, default: "" },
        image: { type: String, default: "" }, // Cloudinary URL
    },
    { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);
