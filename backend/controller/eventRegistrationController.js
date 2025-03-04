// controllers/eventRegistrationController.js
const EventRegistration = require("../models/EventRegistration");

exports.createRegistration = async (req, res) => {
    try {
        // Extract dynamicData from request body
        const { dynamicData } = req.body;

        // Validate that dynamicData is provided, is an object, and is not empty
        if (!dynamicData || typeof dynamicData !== "object" || Object.keys(dynamicData).length === 0) {
            return res
                .status(400)
                .json({ error: "Missing or invalid dynamicData. Please fill in the required fields." });
        }

        // Optionally, add further validation here, e.g. check for specific required keys
        // if (!dynamicData.email || !dynamicData.fullName) { ... }

        // Create the new registration record
        const newReg = await EventRegistration.create({ dynamicData });
        res.status(201).json(newReg);
    } catch (error) {
        console.error("Error creating registration:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllRegistrations = async (req, res) => {
    try {
        // Retrieve all registrations sorted by creation date (newest first)
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
