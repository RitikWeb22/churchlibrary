const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');

// Route to create a new contact message
router.post('/', contactController.createContact);

// Route to get all contact messages
router.get('/', contactController.getContacts);

module.exports = router;
