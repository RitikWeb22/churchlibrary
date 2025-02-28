// controller/paymentController.js
const Payment = require("../models/Payment");
// Destructure the Book model from your exports
const { Book } = require("../models/bookModels");

// Create a new payment (purchase or borrow)
exports.createPayment = async (req, res) => {
    try {
        // paymentData comes from req.body, plus screenshot from Cloudinary if any
        const paymentData = { ...req.body };

        // If a file was uploaded, store the Cloudinary URL
        if (req.file) {
            paymentData.screenshot = req.file.path; // This is the Cloudinary URL
        }

        // If you want a custom date from the frontend, you can parse it here:
        // paymentData.purchaseDate = paymentData.purchaseDate
        //   ? new Date(paymentData.purchaseDate)
        //   : new Date();

        // Generate invoice for cash/online purchases
        if (
            paymentData.paymentMethod === "cash" ||
            paymentData.paymentMethod === "online"
        ) {
            paymentData.invoiceNumber = "INV-" + Date.now();
        }

        // Create the payment record
        const payment = await Payment.create(paymentData);

        // Update the book's stock if a bookId is provided
        if (paymentData.bookId) {
            const book = await Book.findById(paymentData.bookId);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            if (paymentData.paymentMethod === "borrow") {
                // For borrow transactions, set stock to 0
                book.stock = 0;
            } else {
                // For purchase transactions, subtract the purchased quantity
                const purchasedQuantity = Number(paymentData.quantity) || 0;
                if (book.stock < purchasedQuantity) {
                    return res.status(400).json({ message: "Insufficient stock" });
                }
                book.stock -= purchasedQuantity;
            }

            await book.save();
        }

        res.status(201).json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all payments with optional filter by payment method
exports.getPayments = async (req, res) => {
    try {
        const { paymentMethod } = req.query;
        let filter = {};

        if (paymentMethod) {
            filter.paymentMethod = paymentMethod;
        }

        // Make sure your Payment model has "purchaseDate" 
        // or change this to "createdAt" if that's what you have.
        const payments = await Payment.find(filter).sort({ purchaseDate: -1 });

        res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPayment = await Payment.findByIdAndDelete(id);
        if (!deletedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
