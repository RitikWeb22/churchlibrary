// models/EventRegistration.js
const mongoose = require("mongoose");

const EventRegistrationSchema = new mongoose.Schema(
    {
        // Instead of storing specific fields (name, email, phone, etc.),
        // we store everything dynamically in this Mixed type.
        dynamicData: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

// Optional: Basic server-side validation to prevent blank submissions.
// Adjust the requiredFields array to match the dynamicData keys that MUST be present.
EventRegistrationSchema.pre("save", function (next) {
    const doc = this;
    const requiredFields = ["Name", "Email", "Phone No"]; // example keys

    for (const field of requiredFields) {
        const value = doc.dynamicData[field];
        if (!value || !value.trim()) {
            return next(
                new Error(`Missing or empty required field: ${field}`)
            );
        }
    }
    next();
});

module.exports = mongoose.model("EventRegistration", EventRegistrationSchema);
