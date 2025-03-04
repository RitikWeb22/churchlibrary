// controller/paymentController.js
const Payment = require("../models/Payment");
const { Book } = require("../models/bookModels");

exports.createPayment = async (req, res) => {
    try {
        // Spread req.body to get paymentData.
        // Expecting keys: bookName, userName, contactNumber, language, paymentMethod, price, quantity, etc.
        const paymentData = { ...req.body };

        // Log received data for debugging purposes.
        console.log("Received paymentData:", paymentData);

        // If a file was uploaded, add its Cloudinary URL to paymentData.
        if (req.file) {
            paymentData.screenshot = req.file.path; // Cloudinary URL
        }

        // Validate required fields
        const requiredFields = ["bookName", "userName", "contactNumber", "language", "paymentMethod"];
        for (const field of requiredFields) {
            if (!paymentData[field]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        // Optionally, if you expect a custom purchaseDate from the client:
        // paymentData.purchaseDate = paymentData.purchaseDate ? new Date(paymentData.purchaseDate) : new Date();

        // Generate an invoice number for cash/online purchases.
        if (paymentData.paymentMethod === "cash" || paymentData.paymentMethod === "online") {
            paymentData.invoiceNumber = "INV-" + Date.now();
        }

        // Create the payment record in the database.
        const payment = await Payment.create(paymentData);

        // If a bookId is provided, update the book's stock.
        if (paymentData.bookId) {
            const book = await Book.findById(paymentData.bookId);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            if (paymentData.paymentMethod === "borrow") {
                // For borrow transactions, set stock to 0.
                book.stock = 0;
            } else {
                // For purchase transactions, subtract the purchased quantity.
                // Default to 1 if quantity is not provided.
                const purchasedQuantity = Number(paymentData.quantity) || 1;
                if (book.stock < purchasedQuantity) {
                    return res.status(400).json({ message: "Insufficient stock" });
                }
                book.stock -= purchasedQuantity;
            }

            await book.save();
        }

        res.status(201).json(payment);
    } catch (error) {
        console.error("Error in createPayment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const { paymentMethod } = req.query;
        let filter = {};
        if (paymentMethod) {
            filter.paymentMethod = paymentMethod;
        }

        // Using purchaseDate for sorting (or createdAt if you prefer)
        const payments = await Payment.find(filter).sort({ purchaseDate: -1 });
        res.status(200).json(payments);
    } catch (error) {
        console.error("Error in getPayments:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPayment = await Payment.findByIdAndDelete(id);
        if (!deletedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error("Error in deletePayment:", error);
        res.status(500).json({ message: "Server error" });
    }
};
