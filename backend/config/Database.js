const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log('MongoDB Connected Successfully...');
    } catch (err) {
        console.error("This is an error:", err.message);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDB;
