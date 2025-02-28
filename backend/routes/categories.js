// routes/categories.js
const express = require("express");
const router = express.Router();
const {
    getCategories,
    addCategory,
    removeCategory,
} = require("../controller/bookController");

// GET all categories
router.get("/", getCategories);

// POST a new category
router.post("/", addCategory);

// DELETE a category by name (e.g. DELETE /api/categories/morning%20revival)
router.delete("/:name", removeCategory);

module.exports = router;
