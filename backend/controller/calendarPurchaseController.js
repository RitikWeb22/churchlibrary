const CalendarPurchase = require("../models/CalendarPurchase");

const createPurchase = async (req, res) => {
    try {
        const {
            calendarId,
            calendarTitle,
            purchaserName,
            contact,
            price,
            paymentMethod,
            collectorName,
        } = req.body;
        let screenshot = "";
        if (req.file) {
            screenshot = req.file.path;
        }

        if (!calendarId || !calendarTitle || !purchaserName || !contact || !price || !paymentMethod) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // For online payments, collectorName and screenshot are required.
        if (paymentMethod === "Online" && (!collectorName || !screenshot)) {
            return res
                .status(400)
                .json({
                    message: "Collector name and screenshot are required for online payments",
                });
        }

        const purchase = new CalendarPurchase({
            calendarId,
            calendarTitle,
            purchaserName,
            contact,
            price,
            paymentMethod,
            collectorName: paymentMethod === "Online" ? collectorName : undefined,
            screenshot: paymentMethod === "Online" ? screenshot : undefined,
        });
        const savedPurchase = await purchase.save();
        res.status(201).json(savedPurchase);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPurchases = async (req, res) => {
    try {
        const purchases = await CalendarPurchase.find().sort({ purchaseDate: -1 });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPurchase, getPurchases };
