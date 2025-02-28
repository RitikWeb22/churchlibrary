// routes/bannerRoutes.js
const express = require("express");
const router = express.Router();
// Update the import to use bannerUpload
const { bannerUpload } = require("../config/cloudinaryConfig");
const Banner = require("../models/Banner");

// GET /api/banner - Returns the single banner doc if it exists
router.get("/", async (req, res) => {
    try {
        let banner = await Banner.findOne();
        if (!banner) {
            // Return a default banner object if none exist
            return res.json({ title: "", image: "" });
        }
        res.json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/banner - Updates or creates the single banner doc with a new title and optional image
router.put("/", bannerUpload.single("image"), async (req, res) => {
    try {
        let banner = await Banner.findOne();
        if (!banner) {
            banner = new Banner();
        }

        if (req.body.title) {
            banner.title = req.body.title;
        }

        if (req.file) {
            banner.image = req.file.path; // Cloudinary URL from multer-storage-cloudinary
        }

        await banner.save();
        res.json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/banner - Removes the banner doc
router.delete("/", async (req, res) => {
    try {
        const banner = await Banner.findOne();
        if (!banner) {
            return res.status(404).json({ error: "No banner to delete" });
        }
        await Banner.deleteOne({ _id: banner._id });
        res.json({ message: "Banner deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
