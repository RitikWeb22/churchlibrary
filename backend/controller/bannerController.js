const Banner = require("../models/bannerModel");

const uploadBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const bannerData = {
            title: req.body.title || "Banner",
            description: req.body.description || "",
            image: req.file.path, // Cloudinary returns the URL here
        };

        const banner = await Banner.create(bannerData);
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadBanner };
