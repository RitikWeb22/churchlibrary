const Contact = require('../models/Contact');

// Create a new contact message
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, additional } = req.body;
    const contact = new Contact({ name, email, phone, subject, message, additional });
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create contact message' });
  }
};

// Retrieve all contact messages
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};
