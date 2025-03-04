const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinaryConfig");
const Announcement = require("../models/Announcement");

// CREATE (POST /api/announcements)
// Expects a FormData with field "image" for the file
router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log("Request body:", req.body); // Check for link here

        const { title, description, link, date } = req.body;
        let imageUrl = "";
        if (req.file) {
            // With multer-storage-cloudinary, req.file.path is the Cloudinary URL
            imageUrl = req.file.path;
        }

        // Default link to an empty string if not provided
        const announcement = await Announcement.create({
            title,
            description,
            date,
            link: link || "",
            image: imageUrl,
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ ALL (GET /api/announcements)
router.get("/", async (req, res) => {
    try {
        // Sort by most recently created
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ ONE (GET /api/announcements/:id)
router.get("/:id", async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: "Announcement not found" });
        }
        res.json(announcement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE (PUT /api/announcements/:id)
// Also supports new image if user uploads one
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const { title, description, date, link } = req.body;
        const existing = await Announcement.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        // If a new image is uploaded, update the image field
        if (req.file) {
            existing.image = req.file.path;
        }

        // Update fields and default link to empty string if not provided
        if (title) existing.title = title;
        if (description) existing.description = description;
        if (date) existing.date = date;
        existing.link = typeof link !== "undefined" ? link : existing.link;

        await existing.save();
        res.json(existing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE (DELETE /api/announcements/:id)
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Announcement.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Announcement not found" });
        }
        res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
