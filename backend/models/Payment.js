// models/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    userName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    language: { type: String, required: true },
    paymentMethod: {
        type: String,
        enum: ["cash", "online", "borrow"],
        required: true,
    },
    // For purchase transactions
    price: { type: Number },
    quantity: { type: Number },
    // For online payments
    screenshot: { type: String },     // Cloudinary URL will be stored here
    collectorName: { type: String },
    // For borrow transactions
    borrowDate: { type: Date },
    returnDate: { type: Date },
    // Optional invoice field for cash/online purchases
    invoiceNumber: { type: String },

    // We rename or add purchaseDate
    purchaseDate: {
        type: Date,
        default: Date.now, // automatically set the date/time of creation
    },
});

module.exports = mongoose.model("Payment", PaymentSchema);
