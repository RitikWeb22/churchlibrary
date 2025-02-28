const express = require("express");
const router = express.Router();
const RegistrationConfig = require("../models/registrationConfigModel");

// GET /api/registration-config
router.get("/", async (req, res) => {
    try {
        let config = await RegistrationConfig.findOne();
        if (!config) {
            config = new RegistrationConfig();
            await config.save();
        }
        res.json(config.toObject());
    } catch (error) {
        console.error("Error fetching registration config:", error);
        res.status(500).json({ error: "Failed to fetch registration config" });
    }
});

// PUT /api/registration-config
router.put("/", async (req, res) => {
    try {
        const newConfig = req.body;
        let config = await RegistrationConfig.findOne();
        if (!config) {
            config = new RegistrationConfig(newConfig);
        } else {
            for (const key in newConfig) {
                config[key] = newConfig[key];
            }
        }
        await config.save();
        res.json(config.toObject());
    } catch (error) {
        console.error("Error updating registration config:", error);
        res.status(500).json({ error: "Failed to update registration config" });
    }
});

module.exports = router;
