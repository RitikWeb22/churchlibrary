const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: { type: [String], default: [] },
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

const Book = mongoose.model("Book", bookSchema);
const Category = mongoose.model("Category", categorySchema);

module.exports = { Book, Category };
