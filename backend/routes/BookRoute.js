// routes/BookRoute.js
const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinaryConfig");
const bookController = require("../controller/bookController");

// Bulk import route (optional)
router.post("/import", bookController.importBooks);

// Book routes
router.get("/", bookController.getBooks);
router.get("/category/:category", bookController.getBooksByCategory);
router.get("/:id", bookController.getBookById);

// Create & Update with images
router.post("/", upload.array("images"), bookController.createBook);
router.put("/:id", upload.array("images"), bookController.updateBook);

// Delete a book
router.delete("/:id", bookController.deleteBook);

// Standalone file upload route (if needed)
router.post("/upload", upload.single("file"), bookController.uploadFile);

module.exports = router;
