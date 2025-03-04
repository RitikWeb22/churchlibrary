const Calendar = require("../models/calendarModel");

const createCalendar = async (req, res) => {
    try {
        const { title, date, price, isBanner } = req.body;
        if (!title || !date || !price) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        const image = req.file ? req.file.path : "";
        const calendar = new Calendar({
            title,
            date: parsedDate,
            price,
            isBanner: isBanner === "true" || isBanner === true,
            image,
        });
        const savedCalendar = await calendar.save();
        res.status(201).json(savedCalendar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCalendars = async (req, res) => {
    try {
        const calendars = await Calendar.find().sort({ date: 1 });
        res.json(calendars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCalendar = async (req, res) => {
    try {
        const { title, date, price, isBanner } = req.body;
        const updateData = {
            title,
            date: new Date(date),
            price,
            isBanner: isBanner === "true" || isBanner === true,
        };
        if (req.file) {
            updateData.image = req.file.path;
        }
        const calendar = await Calendar.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!calendar) {
            return res.status(404).json({ message: "Calendar not found" });
        }
        res.json(calendar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCalendar = async (req, res) => {
    try {
        const calendar = await Calendar.findByIdAndDelete(req.params.id);
        if (!calendar) {
            return res.status(404).json({ message: "Calendar not found" });
        }
        res.json({ message: "Calendar deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCalendar, getCalendars, updateCalendar, deleteCalendar };
