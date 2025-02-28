// models/EventRegistration.js
const mongoose = require("mongoose");

const EventRegistrationSchema = new mongoose.Schema(
    {
        // Instead of fullName, email, phone, event, etc., we store everything dynamically
        dynamicData: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

module.exports = mongoose.model("EventRegistration", EventRegistrationSchema);
