const { Book, Category } = require("../models/bookModels");

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new book with image upload support
exports.createBook = async (req, res) => {
    try {
        const { title, category, description, price, stock } = req.body;
        const images = (req.files || []).map((file) => file.path);

        const book = await Book.create({
            title,
            category,
            description,
            price: Number(price),
            stock: Number(stock),
            images, // array of Cloudinary URLs
        });

        return res.status(201).json(book);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Update an existing book by ID with image upload support
exports.updateBook = async (req, res) => {
    try {
        if (req.body.price) req.body.price = Number(req.body.price);
        if (req.body.stock) req.body.stock = Number(req.body.stock);

        const existingBook = await Book.findById(req.params.id);
        if (!existingBook) {
            return res.status(404).json({ error: "Book not found" });
        }

        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = req.files.map((file) => file.path);
        }
        existingBook.images = [...existingBook.images, ...newImages];

        existingBook.title = req.body.title ?? existingBook.title;
        existingBook.category = req.body.category ?? existingBook.category;
        existingBook.description = req.body.description ?? existingBook.description;
        existingBook.price = req.body.price ?? existingBook.price;
        existingBook.stock = req.body.stock ?? existingBook.stock;

        const updatedBook = await existingBook.save();
        return res.json(updatedBook);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Delete a book by ID
exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ error: "Book not found" });
        }
        return res.json({ message: "Book deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new category
exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        let category = await Category.findOne({ name });
        if (category) {
            return res.status(400).json({ error: "Category already exists" });
        }
        category = await Category.create({ name });
        return res.status(201).json(category);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// DELETE a category by name
exports.removeCategory = async (req, res) => {
    try {
        const categoryName = req.params.name;
        const category = await Category.findOneAndDelete({ name: categoryName });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        return res.json({
            message: `Category "${categoryName}" removed successfully.`,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Standalone file upload endpoint (if needed)
exports.uploadFile = async (req, res) => {
    try {
        return res.json({ url: req.file.path });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get books by category (case-insensitive)
exports.getBooksByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const books = await Book.find({
            category: { $regex: new RegExp(category, "i") },
        });
        return res.json(books);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Import books (bulk insert) via Excel data
exports.importBooks = async (req, res) => {
    try {
        const booksData = req.body;
        if (!Array.isArray(booksData)) {
            return res.status(400).json({ message: "Expected an array of books" });
        }
        const result = await Book.insertMany(booksData);
        return res.status(201).json({
            message: "Books imported successfully",
            inserted: result.length,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
