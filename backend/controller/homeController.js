const HomeConfig = require("../models/HomeConfig");
const path = require("path");

exports.getHomeConfig = async (req, res) => {
    try {
        let config = await HomeConfig.findOne();
        if (!config) {
            config = new HomeConfig();
            await config.save();
        }
        res.json(config);
    } catch (err) {
        console.error("Error in getHomeConfig:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.updateHomeConfig = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Files received:", req.files);

        let config = await HomeConfig.findOne();
        if (!config) {
            config = new HomeConfig();
        }

        // Update textual fields
        if (req.body.mainText) {
            config.mainText = req.body.mainText;
        }
        if (req.body.sections) {
            try {
                config.sections = JSON.parse(req.body.sections);
            } catch (err) {
                config.sections = req.body.sections;
            }
        }
        if (req.body.bannerTitle) {
            config.bannerTitle = req.body.bannerTitle;
        }
        // Update latestUpdates field if provided.
        if (req.body.latestUpdates) {
            try {
                // Expecting JSON string (array) from client
                config.latestUpdates = JSON.parse(req.body.latestUpdates);
            } catch (err) {
                // If JSON parsing fails, assume a comma-separated string.
                config.latestUpdates = req.body.latestUpdates.split(",").map(item => item.trim());
            }
        }

        // Handle file uploads
        if (req.files.lightBg) {
            const fileName = req.files.lightBg[0].filename;
            config.lightBg = "/uploads/" + fileName;
        }
        if (req.files.darkBg) {
            const fileName = req.files.darkBg[0].filename;
            config.darkBg = "/uploads/" + fileName;
        }
        if (req.files.banner) {
            const fileName = req.files.banner[0].filename;
            config.banner = "/uploads/" + fileName;
        }

        // Ensure eventCalendar object exists
        if (!config.eventCalendar) {
            config.eventCalendar = {};
        }
        if (req.files.eventCalendarPdf) {
            const fileName = req.files.eventCalendarPdf[0].filename;
            config.eventCalendar.pdf = "/uploads/" + fileName;
        }
        if (req.files.eventCalendarBanner) {
            const fileName = req.files.eventCalendarBanner[0].filename;
            config.eventCalendar.banner = "/uploads/" + fileName;
        }

        await config.save();
        res.json({ message: "Home configuration updated successfully", config });
    } catch (err) {
        console.error("Error in updateHomeConfig:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
