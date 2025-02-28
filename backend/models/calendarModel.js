const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        price: { type: Number, required: true },
        isBanner: { type: Boolean, default: false },
        image: { type: String }, // URL from Cloudinary
    },
    { timestamps: true }
);

module.exports = mongoose.model("Calendar", calendarSchema);
