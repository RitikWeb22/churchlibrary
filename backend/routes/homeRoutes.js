const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

// GET home configuration
router.get("/", homeController.getHomeConfig);

// PUT update home configuration – expects file fields "lightBg", "darkBg", "banner", "eventCalendarPdf", and "eventCalendarBanner"
// The text fields (mainText, bannerTitle, sections, latestUpdates) are sent as form data.
router.put(
    "/",
    upload.fields([
        { name: "lightBg", maxCount: 1 },
        { name: "darkBg", maxCount: 1 },
        { name: "banner", maxCount: 1 },
        { name: "eventCalendarPdf", maxCount: 1 },
        { name: "eventCalendarBanner", maxCount: 1 },
    ]),
    homeController.updateHomeConfig
);

module.exports = router;
