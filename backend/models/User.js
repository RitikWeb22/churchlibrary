const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, unique: true, sparse: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
        twoFactorSecret: { type: String },
        otp: { type: String },         // <-- Add this field for OTP
        otpExpires: { type: Date },      // <-- And this field for OTP expiry
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const pepperedPassword = this.password + process.env.PEPPER;
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(pepperedPassword, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(
        enteredPassword + process.env.PEPPER,
        this.password
    );
};

module.exports = mongoose.model("User", userSchema);
