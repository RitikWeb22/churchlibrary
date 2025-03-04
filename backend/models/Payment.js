// models/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    // Name of the book (mapped from client’s bookTitle)
    bookName: { type: String, required: true },
    // Name of the buyer (mapped from client’s buyerName to userName)
    userName: { type: String, required: true },
    // Contact number of the buyer (mapped from client’s contact to contactNumber)
    contactNumber: { type: String, required: true },
    // Language field required from the client
    language: { type: String, required: true },
    // Payment method: cash, online, or borrow
    paymentMethod: {
        type: String,
        enum: ["cash", "online", "borrow"],
        required: true,
    },
    // For purchase transactions
    price: { type: Number },
    quantity: { type: Number },
    // For online payments: a URL for the screenshot stored on Cloudinary
    screenshot: { type: String },
    collectorName: { type: String },
    // For borrow transactions
    borrowDate: { type: Date },
    returnDate: { type: Date },
    // Optional invoice field for cash/online purchases
    invoiceNumber: { type: String },
    // Purchase date is automatically set on creation
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Payment", PaymentSchema);
