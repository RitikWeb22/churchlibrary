const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Files will be saved in the "uploads" folder
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        // Use field name, current timestamp, and original extension
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

// The "upload" middleware can handle multiple fields
const upload = multer({ storage });

// GET home configuration
router.get("/", homeController.getHomeConfig);

// PUT update home configuration – expects file fields "lightBg", "darkBg", "banner", "eventCalendarPdf", and "eventCalendarBanner"
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
