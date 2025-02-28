const mongoose = require("mongoose");

const RegistrationConfigSchema = new mongoose.Schema({
    fullName: { type: String, default: "Full Name" },
    email: { type: String, default: "Email" },
    phone: { type: String, default: "Phone Number" },
    event: {
        label: { type: String, default: "Select Event" },
        options: {
            type: [String],
            default: ["Sunday Worship", "Bible Study", "Community Fellowship", "Choir Practice"]
        }
    },
    message: { type: String, default: "Special Requests" }
});

module.exports = mongoose.model("RegistrationConfig", RegistrationConfigSchema);
