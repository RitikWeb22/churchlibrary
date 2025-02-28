// models/Announcement.js
const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        date: { type: Date },
        // We'll store the Cloudinary URL here
        image: { type: String },
        link: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Announcement", AnnouncementSchema);
