const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinaryConfig"); // Using generic upload for purchase screenshot
const { createPurchase, getPurchases } = require("../controller/calendarPurchaseController");

// POST create a new purchase
router.post("/", upload.single("screenshot"), createPurchase);

// GET all purchases
router.get("/", getPurchases);

module.exports = router;
