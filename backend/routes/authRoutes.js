// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Import middleware
const { protect, adminAuth } = require("../middleware/authMiddleware");

// Import your controller functions
const {
    registerUser,
    forgotPassword,
    verifyPhoneNumber,
    resetPassword,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
    importUsersHandler,
    checkPhoneNumber,
    loginUser,
    addPhoneNumber
    // Must match the export name in authController
} = require("../controller/authController");

const User = require("../models/User");

// ----- Multer setup for Excel uploads -----
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// ----- Public Routes -----
// GET all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register & Login
router.post("/check-phone", checkPhoneNumber);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/add-phone", /* adminAuth, */ addPhoneNumber);

// Forgot password flow
router.post("/forgot", forgotPassword);
router.post("/verify-phone", verifyPhoneNumber);
router.post("/reset-password", resetPassword);

// ----- Admin-Only Routes -----
router.post("/create-user", protect, adminAuth, createUser);
router.put("/users/:id", protect, adminAuth, updateUser);
router.put("/users/:id/role", protect, adminAuth, updateUserRole);
router.delete("/users/:id", protect, adminAuth, deleteUser);

// 5) Import Users from Excel
router.post(
    "/import-users",
    protect,
    adminAuth,
    upload.single("excel"),
    importUsersHandler
);

module.exports = router;
