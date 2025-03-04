const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const rateLimit = require("express-rate-limit");

const { protect, adminAuth } = require("../middleware/authMiddleware");

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
    addPhoneNumber,
    enableTwoFactorAuth,
    verifyTwoFactorToken,
    sendOTP,        // <-- New
    verifyOTP,      // <-- New
} = require("../controller/authController");

const User = require("../models/User");

// Rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message:
        "Too many login attempts from this IP, please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});

// Multer setup for Excel uploads
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
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Authentication routes
router.post("/check-phone", checkPhoneNumber);
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/add-phone", addPhoneNumber);

// Password reset flow
router.post("/forgot", forgotPassword);
router.post("/verify-phone", verifyPhoneNumber);
router.post("/reset-password", resetPassword);

// Two-Factor Authentication Routes
router.post("/enable-2fa", protect, enableTwoFactorAuth);
router.post("/verify-2fa", protect, verifyTwoFactorToken);

// --------- New OTP Routes ---------
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// ----- Admin-Only Routes -----
router.post("/create-user", protect, adminAuth, createUser);
router.put("/users/:id", protect, adminAuth, updateUser);
router.put("/users/:id/role", protect, adminAuth, updateUserRole);
router.delete("/users/:id", protect, adminAuth, deleteUser);
router.post("/import-users", protect, adminAuth, upload.single("excel"), importUsersHandler);

module.exports = router;
