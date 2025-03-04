// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { createPayment, getPayments, deletePayment } = require("../controller/paymentController");

// Import the Cloudinary upload middleware (ensure this file is configured correctly)
const { upload } = require("../config/cloudinaryConfig");

// POST /payments - Create a new payment, including file upload for "screenshot"
router.post("/", upload.single("screenshot"), createPayment);

// GET /payments - Retrieve all payments (optionally with filtering inside the controller)
router.get("/", getPayments);

// DELETE /payments/:id - Delete a specific payment by its ID
router.delete("/:id", deletePayment);

module.exports = router;
