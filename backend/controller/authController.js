const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const XLSX = require("xlsx");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");

// Helper function to normalize phone numbers (trim and remove spaces)
const normalizePhone = (phone) => phone.trim();

const getDummyEmail = (phone) =>
    `${normalizePhone(phone)}@example.com`.toLowerCase();

// Create a Nodemailer transporter using SMTP credentials from environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // false for port 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    logger: true,
    debug: true, // Enable debugging to see detailed SMTP logs
});

// ------------------------------------------
// Send OTP for Forgot Password or Verification
// ------------------------------------------
exports.sendOTP = async (req, res) => {
    try {
        const { phone, email } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required." });
        }
        const normalizedPhone = normalizePhone(phone);
        const user = await User.findOne({ phone: normalizedPhone });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // Generate a random 6-digit OTP as a string
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Set OTP expiry to 5 minutes from now as a Date object
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        // Determine the recipient email:
        // If the request provides an email, use it; otherwise use the user's stored email.
        const recipient = email ? email : user.email;
        if (recipient && recipient !== getDummyEmail(normalizedPhone)) {
            // Compose the email options
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: recipient,
                subject: "Your OTP for Registration / Verification",
                text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending OTP email:", error);
                } else {
                    console.log("OTP email sent:", info.response);
                }
            });
        } else {
            console.log("No valid recipient email found. OTP will not be sent via email.");
        }

        // For development purposes, return the OTP in the response
        res.status(200).json({ message: "OTP sent successfully.", otp });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// Verify OTP
// ------------------------------------------
exports.verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res
                .status(400)
                .json({ message: "Phone number and OTP are required." });
        }
        const normalizedPhone = normalizePhone(phone);
        const user = await User.findOne({ phone: normalizedPhone });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // Debug logging for development
        console.log("Stored OTP:", user.otp);
        console.log("Received OTP:", otp);
        console.log("OTP expires at:", user.otpExpires, "Current time:", Date.now());

        // Check if the OTP matches and has not expired
        if (user.otp !== otp || new Date(user.otpExpires).getTime() < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }
        // OTP verified: clear OTP fields
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.status(200).json({ message: "OTP verified successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ----- (Remaining endpoints remain unchanged) -----


// Helper function to normalize phone numbers (trim and remove spaces)

// Helper function to generate the dummy email based on phone number

// ------------------------------------------
// 1) Add Phone Number (Pre‑Registration)
// ------------------------------------------
exports.addPhoneNumber = async (req, res) => {
    try {
        let { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required." });
        }
        phone = normalizePhone(phone);

        // Check if a user record with this phone already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "Phone number already exists." });
        }

        // Create a new user record with dummy defaults.
        const dummyFullName = "Pre-Registered User";
        const dummyEmail = getDummyEmail(phone);
        const dummyPassword = "defaultPassword123"; // This will be hashed automatically.

        const newUser = new User({
            fullName: dummyFullName,
            email: dummyEmail,
            password: dummyPassword,
            phone,
            role: "user",
        });
        await newUser.save();
        res.status(201).json({ message: "Phone number added successfully.", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 2) Register User (Complete Registration)
// ------------------------------------------
exports.registerUser = async (req, res) => {
    try {
        let { fullName, email, password, phone } = req.body;
        phone = normalizePhone(phone);

        // Look up the user by phone number (should be pre‑added by admin)
        const existingUser = await User.findOne({ phone });
        if (!existingUser) {
            return res.status(400).json({ message: "Phone number not recognized. Please contact admin." });
        }

        const dummyEmail = getDummyEmail(phone);

        // If the record already has a different email than the dummy,
        // consider the user as already registered.
        if (existingUser.email && existingUser.email.trim().toLowerCase() !== dummyEmail) {
            return res.status(400).json({ message: "User already registered with this phone." });
        }

        // Update the record with the registration details.
        existingUser.fullName = fullName;
        existingUser.email = email.toLowerCase();
        existingUser.password = password; // Will be hashed in the pre-save hook.
        await existingUser.save();

        res.status(200).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 3) Check Phone Number Availability for Registration
// ------------------------------------------
exports.checkPhoneNumber = async (req, res) => {
    try {
        let { phone } = req.body;
        phone = normalizePhone(phone);
        const user = await User.findOne({ phone });
        const dummyEmail = getDummyEmail(phone);

        if (!user) {
            // If the phone is not found, we return status "not_found"
            return res.status(200).json({ status: "not_found", message: "Phone number not recognized." });
        }

        // If the user's email is different than the dummy, consider it already registered.
        if (user.email && user.email.trim().toLowerCase() !== dummyEmail) {
            return res.status(200).json({ status: "already_registered", message: "User already registered with this phone." });
        }

        // Otherwise, the phone exists and is pre-registered.
        res.status(200).json({ status: "pre_registered", message: "Phone number is available for registration." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 4) Login User (phone-based) – Updated with cookie-parser support
// ------------------------------------------
exports.loginUser = async (req, res) => {
    try {
        let { phoneNumber, password } = req.body;
        phoneNumber = normalizePhone(phoneNumber);

        const user = await User.findOne({ phone: phoneNumber });
        if (!user) {
            return res.status(401).json({ message: "Invalid phone or password." });
        }

        // Compare password (if using pre-save hook with pepper, adjust accordingly)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid phone or password." });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("Missing JWT_SECRET in environment variables.");
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Set token in an HTTP‑only cookie for security
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: "Logged in successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... Remaining endpoints remain unchanged ...

// ------------------------------------------
// 5) Forgot Password (Secure Implementation)
// ------------------------------------------
exports.forgotPassword = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required." });
        }
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        // Hash the token before saving it in the database
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Set token and expiration on user document (expires in 1 hour)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();

        // In production, send the resetToken via email or SMS.
        // For development purposes, we return the token in the response.
        res.json({
            message: "Password reset token generated and sent.",
            resetToken, // Remove this in production!
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 6) Reset Password (Secure Implementation)
// ------------------------------------------
exports.resetPassword = async (req, res) => {
    try {
        const { phone, token, newPassword } = req.body;
        if (!phone || !token || !newPassword) {
            return res.status(400).json({ message: "Phone number, token, and new password are required." });
        }

        // Hash the provided token to compare with the stored hash
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Find user by phone and matching token, and ensure the token hasn't expired
        const user = await User.findOne({
            phone,
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Update password and clear reset token fields
        user.password = newPassword; // This will be hashed in the pre-save hook.
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 7) Verify Phone Number
// ------------------------------------------
exports.verifyPhoneNumber = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required." });
        }
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: "Phone number not found. Please contact admin." });
        }
        res.status(200).json({ message: "Phone number verified." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 8) Create a User (Admin-Only)
// ------------------------------------------
exports.createUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        // Check if the phone number is already pre‑added by an admin
        const existingUser = await User.findOne({ phone });
        if (!existingUser) {
            return res.status(400).json({ message: "Phone number not recognized. Please add this number first." });
        }

        // If the record is already registered, do not allow re‑registration.
        if (existingUser.email && existingUser.email.trim() !== "") {
            return res.status(400).json({ message: "User with this phone is already registered." });
        }

        // Update the record with the new details.
        existingUser.fullName = fullName;
        existingUser.email = email.toLowerCase();
        existingUser.password = password; // Will be hashed via pre-save hook.
        existingUser.role = role || "user";
        await existingUser.save();

        res.status(200).json({ message: "User registered successfully.", user: existingUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 9) Update a User's Basic Info
// ------------------------------------------
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (fullName) user.fullName = fullName;
        if (email) user.email = email.toLowerCase();
        if (phone) user.phone = phone;

        await user.save();
        res.json({ message: "User updated successfully.", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 10) Update a User's Role
// ------------------------------------------
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.role = role;
        await user.save();
        res.json({ message: "User role updated.", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 11) Delete a User
// ------------------------------------------
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found or already deleted." });
        }

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 12) Import Users from Excel (Admin-Only)
// ------------------------------------------
exports.importUsersHandler = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No Excel file uploaded." });
        }

        // Parse the uploaded Excel file
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        // For each row, create or update user
        for (const row of rows) {
            const serialNo = row["s.no"];
            const fullName = row["Full Name"] || "No Name";
            const emailLower = (row["Email"] || "").toLowerCase().trim();
            const phone = (row["Contact Number"] || "").trim();

            if (!emailLower) continue;

            let existingUser = await User.findOne({ email: emailLower });
            if (!existingUser) {
                // Create new user with a default password; pre‑save hook will hash it.
                const newUser = new User({
                    fullName,
                    email: emailLower,
                    phone,
                    password: "secret123", // default plain text password
                    role: "user",
                });
                await newUser.save();
            } else {
                // Update existing user
                existingUser.fullName = fullName;
                existingUser.phone = phone;
                await existingUser.save();
            }
        }

        res.json({ message: "Users imported successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ------------------------------------------
// 13) Enable Two‑Factor Authentication (2FA)
// ------------------------------------------
exports.enableTwoFactorAuth = async (req, res) => {
    try {
        // This endpoint should be protected so req.user is available
        const user = req.user;

        // Generate a secret for TOTP
        const secret = speakeasy.generateSecret({
            name: `YourAppName (${user.email})`,
        });

        // Save the secret in the user record (update your User model to include twoFactorSecret)
        user.twoFactorSecret = secret.base32;
        // Optionally, set a flag like user.twoFactorEnabled = true;
        await user.save();

        // Optionally, generate a QR code for easy setup:
        // qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
        //   if (err) throw err;
        //   res.json({ message: "2FA enabled. Scan the QR code.", qrCode: data_url, secret: secret.base32 });
        // });

        res.json({ message: "2FA secret generated. Please configure your authenticator app.", secret: secret.base32 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 14) Verify Two‑Factor Authentication Token
// ------------------------------------------
exports.verifyTwoFactorToken = async (req, res) => {
    try {
        const { token } = req.body;
        const user = req.user; // Must be set by protect middleware

        if (!user.twoFactorSecret) {
            return res.status(400).json({ message: "2FA is not enabled for this account." });
        }

        // Verify the token provided by the user
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token,
            window: 1, // Allows for slight time drift
        });

        if (!verified) {
            return res.status(400).json({ message: "Invalid 2FA token." });
        }

        res.json({ message: "2FA token verified successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
