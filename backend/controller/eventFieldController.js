// controllers/eventFieldController.js (example)
const EventField = require("../models/EventField");

exports.getFormFields = async (req, res) => {
    try {
        const fields = await EventField.find().sort({ order: 1 });
        res.json(fields);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createFormField = async (req, res) => {
    try {
        // req.body may look like:
        // {
        //   "label": "Event",
        //   "type": "dropdown",
        //   "options": [
        //     { "name": "Sunday Worship", "date": "2023-09-10", ... },
        //     ...
        //   ]
        // }
        const field = await EventField.create(req.body);
        res.json(field);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateFormField = async (req, res) => {
    try {
        const field = await EventField.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(field);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteFormField = async (req, res) => {
    try {
        await EventField.findByIdAndDelete(req.params.id);
        res.json({ message: "Field deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// You can also keep your updateFieldOrder or other endpoints as is
