const express = require("express");
const router = express.Router();
const FormField = require("../models/EventField");

// GET /api/event-fields
router.get("/", async (req, res) => {
    try {
        const fields = await FormField.find().sort({ order: 1 });
        res.json(fields);
    } catch (error) {
        console.error("Error fetching form fields:", error);
        res.status(500).json({ error: "Failed to fetch form fields" });
    }
});

// POST /api/event-fields
router.post("/", async (req, res) => {
    try {
        const fieldData = req.body;
        const newField = new FormField(fieldData);
        await newField.save();
        res.json(newField);
    } catch (error) {
        console.error("Error creating form field:", error);
        res.status(500).json({ error: "Failed to create form field" });
    }
});

// PUT /api/event-fields/:id
router.put("/:id", async (req, res) => {
    try {
        const updatedField = await FormField.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedField);
    } catch (error) {
        console.error("Error updating form field:", error);
        res.status(500).json({ error: "Failed to update form field" });
    }
});

// DELETE /api/event-fields/:id
router.delete("/:id", async (req, res) => {
    try {
        const deletedField = await FormField.findByIdAndDelete(req.params.id);
        if (!deletedField) return res.status(404).json({ error: "Field not found" });
        res.json({ message: "Field deleted", field: deletedField });
    } catch (error) {
        console.error("Error deleting form field:", error);
        res.status(500).json({ error: "Failed to delete form field" });
    }
});

// PUT /api/event-fields/order
router.put("/order", async (req, res) => {
    try {
        const orderArray = req.body; // Expecting an array of { id, order }
        if (!Array.isArray(orderArray)) {
            return res.status(400).json({ error: "Payload must be an array" });
        }
        // Update each field’s order property
        await Promise.all(orderArray.map(item =>
            FormField.findByIdAndUpdate(item.id, { order: item.order })
        ));
        // Return the updated fields, sorted by order
        const updatedFields = await FormField.find().sort({ order: 1 });
        res.json(updatedFields);
    } catch (error) {
        console.error("Error updating field ordering:", error);
        res.status(500).json({ error: "Failed to update field ordering" });
    }
});

module.exports = router;
