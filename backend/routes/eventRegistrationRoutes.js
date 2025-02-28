// routes/eventRegistrationRoutes.js
const express = require("express");
const router = express.Router();
const {
    getAllRegistrations,
    createRegistration,
    deleteRegistration,
} = require("../controller/eventRegistrationController");

// GET /api/event-registrations → list all registrations
router.get("/", getAllRegistrations);

// POST /api/event-registrations → create new registration
router.post("/", createRegistration);

// DELETE /api/event-registrations/:id → delete a registration by ID
router.delete("/:id", deleteRegistration);

module.exports = router;
