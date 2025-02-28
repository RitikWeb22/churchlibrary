// models/ImportantLink.js
const mongoose = require("mongoose");

const ImportantLinkSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ImportantLink", ImportantLinkSchema);
