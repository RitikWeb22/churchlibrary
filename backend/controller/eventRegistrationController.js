// controllers/eventRegistrationController.js
const EventRegistration = require("../models/EventRegistration");

exports.createRegistration = async (req, res) => {
    try {
        // The form data is in req.body
        // Instead of fullName/email/phone, we now expect `req.body.dynamicData`
        const { dynamicData } = req.body;

        if (!dynamicData || typeof dynamicData !== "object") {
            return res.status(400).json({ error: "Missing or invalid dynamicData" });
        }

        const newReg = await EventRegistration.create({ dynamicData });
        res.status(201).json(newReg);
    } catch (error) {
        console.error("Error creating registration:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllRegistrations = async (req, res) => {
    try {
        // Return all registrations, each containing dynamicData
        const regs = await EventRegistration.find().sort({ createdAt: -1 });
        res.json(regs);
    } catch (error) {
        console.error("Error fetching registrations:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await EventRegistration.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Registration not found" });
        }
        res.json({ message: "Registration deleted successfully" });
    } catch (error) {
        console.error("Error deleting registration:", error);
        res.status(500).json({ error: error.message });
    }
};
