// models/EventField.js
const mongoose = require("mongoose");

const FormFieldSchema = new mongoose.Schema({
    label: { type: String, required: true },
    type: { type: String, required: true },
    // Allow an array of Mixed (either strings or objects)
    options: [{ type: mongoose.Schema.Types.Mixed }],
    order: { type: Number, default: 0 },
});

module.exports = mongoose.model("FormField", FormFieldSchema);
