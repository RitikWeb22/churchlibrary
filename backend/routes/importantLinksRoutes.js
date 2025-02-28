// routes/importantLinksRoutes.js
const express = require("express");
const router = express.Router();
const ImportantLink = require("../models/ImportantLink");

// CREATE: POST /api/important-links
router.post("/", async (req, res) => {
    try {
        const { title, url } = req.body;
        if (!title || !url) {
            return res.status(400).json({ error: "title and url are required" });
        }

        const newLink = await ImportantLink.create({ title, url });
        res.status(201).json(newLink);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ ALL: GET /api/important-links
router.get("/", async (req, res) => {
    try {
        const links = await ImportantLink.find().sort({ createdAt: -1 });
        res.json(links);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ ONE: GET /api/important-links/:id
router.get("/:id", async (req, res) => {
    try {
        const link = await ImportantLink.findById(req.params.id);
        if (!link) {
            return res.status(404).json({ error: "Link not found" });
        }
        res.json(link);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE: PUT /api/important-links/:id
router.put("/:id", async (req, res) => {
    try {
        const { title, url } = req.body;
        const link = await ImportantLink.findById(req.params.id);
        if (!link) {
            return res.status(404).json({ error: "Link not found" });
        }

        if (title) link.title = title;
        if (url) link.url = url;

        await link.save();
        res.json(link);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: DELETE /api/important-links/:id
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await ImportantLink.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Link not found" });
        }
        res.json({ message: "Link deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
