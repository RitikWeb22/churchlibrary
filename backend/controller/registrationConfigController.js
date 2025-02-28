// controllers/registrationConfigController.js
const RegistrationConfig = require("../models/registrationConfigModel");

// GET the registration configuration (assumes a single config document)
exports.getRegistrationConfig = async (req, res) => {
    try {
        let config = await RegistrationConfig.findOne();
        if (!config) {
            // If no config exists, create a default one
            config = await RegistrationConfig.create({});
        }
        res.json(config);
    } catch (error) {
        console.error("Error fetching registration config:", error);
        res.status(500).json({ error: error.message });
    }
};

// PUT to update the registration configuration
// controllers/registrationConfigController.js


exports.updateRegistrationConfig = async (req, res) => {
    try {
        // Retrieve the current configuration document.
        let currentConfig = await RegistrationConfig.findOne();
        if (!currentConfig) {
            currentConfig = await RegistrationConfig.create({});
        }
        const currentObj = currentConfig.toObject();

        // Build the $unset operator for keys that are in currentConfig but not in req.body.
        const keysToUnset = {};
        Object.keys(currentObj).forEach((key) => {
            if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) return;
            if (!(key in req.body)) {
                keysToUnset[key] = "";
            }
        });

        const update = {
            $set: req.body,
        };
        if (Object.keys(keysToUnset).length > 0) {
            update.$unset = keysToUnset;
        }

        const options = { new: true, upsert: true };
        const updatedConfig = await RegistrationConfig.findOneAndUpdate({}, update, options);
        res.json(updatedConfig);
    } catch (error) {
        console.error("Error updating registration config:", error);
        res.status(500).json({ error: error.message });
    }
};
