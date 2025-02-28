const express = require("express");
const router = express.Router();
const { calendarUpload } = require("../config/cloudinaryConfig");
const { createCalendar, getCalendars, updateCalendar, deleteCalendar } = require("../controller/calendarController");

// Use the controller directly as middleware
router.get("/", getCalendars);
router.post("/", calendarUpload.single("image"), createCalendar);
router.put("/:id", calendarUpload.single("image"), updateCalendar);
router.delete("/:id", deleteCalendar);

module.exports = router;
