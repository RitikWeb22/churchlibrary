// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const {
    createPayment,
    getPayments,
    deletePayment,
} = require("../controller/paymentController");

// Import the Cloudinary upload middleware
const { upload } = require("../config/cloudinaryConfig");

// POST route to create a new payment
// Use upload.single("screenshot") to handle file upload from the frontend
router.post("/", upload.single("screenshot"), createPayment);

// GET route to fetch payments (with optional filter)
router.get("/", getPayments);

// DELETE route to delete a payment
router.delete("/:id", deletePayment);

module.exports = router;
