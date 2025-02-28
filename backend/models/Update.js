const mongoose = require("mongoose");

const UpdateSchema = new mongoose.Schema({
    update: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Update", UpdateSchema);
