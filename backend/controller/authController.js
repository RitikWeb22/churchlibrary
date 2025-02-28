// controller/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const XLSX = require("xlsx"); // For Excel import

// ------------------------------------------
// 1) Register User (Update Pre‑populated User Record)
// ------------------------------------------// controller/authController.js
exports.addPhoneNumber = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required." });
        }
        // Check if a user record with this phone already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "Phone number already exists." });
        }
        // Create a new user record with dummy defaults.
        const dummyFullName = "Pre-Registered User";
        const dummyEmail = `${phone}@example.com`.toLowerCase();
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
        console.error("[addPhoneNumber] error:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;
        console.log("[registerUser] req.body:", req.body);

        // Look up the user by phone number (should be pre-added by admin)
        const existingUser = await User.findOne({ phone });
        if (!existingUser) {
            return res.status(400).json({ message: "Phone number not recognized. Please contact admin." });
        }

        // Determine dummy email for a pre-registered record
        const dummyEmail = `${phone}@example.com`;

        // If the record already has a different email than the dummy,
        // consider the user as already registered.
        if (existingUser.email && existingUser.email.trim() !== dummyEmail) {
            return res.status(400).json({ message: "User already registered with this phone." });
        }

        // Update the record with the registration details.
        existingUser.fullName = fullName;
        existingUser.email = email.toLowerCase();
        existingUser.password = password; // Will be hashed in the pre-save hook.
        await existingUser.save();

        res.status(200).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("[registerUser] error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// New: Check Phone Number Availability for Registration
// ------------------------------------------
exports.checkPhoneNumber = async (req, res) => {
    try {
        const { phone } = req.body;
        console.log("[checkPhoneNumber] phone:", phone);
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: "Phone number not recognized." });
        }
        const dummyEmail = `${phone}@example.com`;
        if (user.email && user.email.trim() !== dummyEmail) {
            return res.status(400).json({ message: "User already registered with this phone." });
        }
        res.status(200).json({ message: "Phone number is available for registration." });
    } catch (error) {
        console.error("[checkPhoneNumber] error:", error);
        res.status(500).json({ message: error.message });
    }
};


// ------------------------------------------
// 2) Login User (phone-based) – remains unchanged
// ------------------------------------------
exports.loginUser = async (req, res) => {
    try {
        console.log("[loginUser] req.body:", req.body);
        const { phoneNumber, password } = req.body;
        const user = await User.findOne({ phone: phoneNumber });
        if (!user) {
            return res.status(401).json({ message: "Invalid phone or password." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid phone or password." });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("Missing JWT_SECRET in environment variables.");
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user });
    } catch (error) {
        console.error("[loginUser] error:", error);
        res.status(500).json({ message: error.message });
    }
};



// ------------------------------------------
// 3) Forgot Password (dummy)
exports.forgotPassword = async (req, res) => {
    // Placeholder
    res.json({ message: "Password reset link sent!" });
};

// ------------------------------------------
// 4) Verify Phone Number
exports.verifyPhoneNumber = async (req, res) => {
    try {
        const { phone } = req.body;
        console.log("[verifyPhoneNumber] phone:", phone);

        if (!phone) {
            return res.status(400).json({ message: "Phone number is required." });
        }
        const user = await User.findOne({ phone });
        if (!user) {
            return res
                .status(404)
                .json({ message: "Phone number not found. Please contact admin." });
        }
        res.json({ message: "Phone number verified." });
    } catch (error) {
        console.error("[verifyPhoneNumber] error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// 5) Reset Password (by phone)
exports.resetPassword = async (req, res) => {
    try {
        const { phone, newPassword } = req.body;
        console.log("[resetPassword] phone:", phone, "newPassword:", newPassword);

        if (!phone || !newPassword) {
            return res
                .status(400)
                .json({ message: "Phone number and new password are required." });
        }
        const user = await User.findOne({ phone });
        if (!user) {
            return res
                .status(404)
                .json({ message: "Phone number not found. Please contact admin." });
        }

        // If you'd rather rely on the pre-save hook, set user.password = newPassword
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("[resetPassword] error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------
// New Admin Endpoints
// ------------------------------------------

// 6) Create a user (admin-only)// controller/authController.js
exports.createUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;
        console.log("[createUser] req.body:", req.body);

        // Check if the phone number is already pre-added by an admin
        const existingUser = await User.findOne({ phone });
        if (!existingUser) {
            // The phone is not in the database
            return res.status(400).json({ message: "Phone number not recognized. Please add this number first." });
        }

        // If the record is already registered (for example, email is set), do not allow re‑registration.
        if (existingUser.email && existingUser.email.trim() !== "") {
            return res.status(400).json({ message: "User with this phone is already registered." });
        }

        // Otherwise, update the record with the new details.
        existingUser.fullName = fullName;
        existingUser.email = email.toLowerCase();
        existingUser.password = password; // The pre-save hook in User.js will hash it.
        existingUser.role = role || "user";
        await existingUser.save();

        res.status(200).json({ message: "User registered successfully.", user: existingUser });
    } catch (error) {
        console.error("[createUser] error:", error);
        res.status(500).json({ message: error.message });
    }
};


// 7) Update a user's basic info
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone } = req.body;
        console.log("[updateUser] id:", id, "body:", req.body);

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (fullName) user.fullName = fullName;
        if (email) user.email = email.toLowerCase();
        if (phone) user.phone = phone;

        // If you do NOT want to allow password changes here, do nothing about password
        await user.save();
        res.json({ message: "User updated successfully.", user });
    } catch (error) {
        console.error("[updateUser] error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 8) Update a user's role
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        console.log("[updateUserRole] id:", id, "role:", role);

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.role = role;
        await user.save();
        res.json({ message: "User role updated.", user });
    } catch (error) {
        console.error("[updateUserRole] error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 9) Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("[deleteUser] id:", id);

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found or already deleted." });
        }

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("[deleteUser] error:", error);
        res.status(500).json({ message: error.message });
    }
};

// 10) Import users from Excel (admin-only)
exports.importUsersHandler = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No Excel file uploaded." });
        }

        console.log("[importUsersHandler] file:", req.file.path);

        // 1) Parse the uploaded Excel file
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);
        console.log("[importUsersHandler] rows:", rows);

        // 2) For each row, create or update user
        for (const row of rows) {
            const serialNo = row["s.no"];
            const fullName = row["Full Name"] || "No Name";
            const emailLower = (row["Email"] || "").toLowerCase().trim();
            const phone = (row["Contact Number"] || "").trim();

            if (!emailLower) continue;

            let existingUser = await User.findOne({ email: emailLower });
            if (!existingUser) {
                // Create new user with a default password, let pre-save hook do the hashing
                const newUser = new User({
                    fullName,
                    email: emailLower,
                    phone,
                    password: "secret123", // plain text default
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
        console.error("[importUsersHandler] error:", error);
        res.status(500).json({ error: error.message });
    }
};
