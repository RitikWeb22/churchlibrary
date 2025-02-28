const express = require("express");
const router = express.Router();
const { contactBannerUpload } = require("../config/cloudinaryConfig");
const contactBannerController = require("../controller/contactBannerController");

// GET the current contact banner
router.get("/", contactBannerController.getContactBanner);

// POST to upload/update the contact banner image
router.post("/", contactBannerUpload.single("banner"), contactBannerController.uploadContactBanner);

module.exports = router;
