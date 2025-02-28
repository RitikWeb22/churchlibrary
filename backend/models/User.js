// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, unique: true, sparse: true }, // phone is optional but unique
        role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    { timestamps: true }
);

// -------------------------------------------------------------
// Pre-save hook to hash password automatically if it's modified
// -------------------------------------------------------------
userSchema.pre("save", async function (next) {
    // Only hash if password is new or changed
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// -------------------------------------------------------------
// Optional helper method to compare a plain password
// with the user's hashed password in the database
// -------------------------------------------------------------
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
