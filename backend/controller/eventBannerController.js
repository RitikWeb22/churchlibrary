const EventBanner = require("../models/EventBanner");

// GET the banner (assuming only 1 document)
exports.getBanner = async (req, res) => {
    try {
        let banner = await EventBanner.findOne();
        if (!banner) {
            // If no banner exists, create a default one
            banner = await EventBanner.create({});
        }
        res.json(banner);
    } catch (error) {
        console.error("Error fetching banner:", error);
        res.status(500).json({ error: error.message });
    }
};

// UPDATE the banner (title + image URL)
exports.updateBanner = async (req, res) => {
    try {
        const { title } = req.body;

        // Ensure a banner document exists
        let banner = await EventBanner.findOne();
        if (!banner) {
            banner = await EventBanner.create({});
        }

        // Update title if provided
        if (title !== undefined) {
            banner.title = title;
        }

        // If a file was uploaded, update the image URL from Cloudinary
        if (req.file) {
            banner.image = req.file.path; // Cloudinary returns the URL in req.file.path
        }

        await banner.save();
        res.json(banner);
    } catch (error) {
        console.error("Error updating banner:", error);
        res.status(500).json({ error: error.message });
    }
};
