const mongoose = require("mongoose");

const calendarPurchaseSchema = new mongoose.Schema(
    {
        calendarId: { type: mongoose.Schema.Types.ObjectId, ref: "Calendar", required: true },
        calendarTitle: { type: String, required: true },
        purchaserName: { type: String, required: true },
        contact: { type: String, required: true },
        price: { type: Number, required: true },
        purchaseDate: { type: Date, default: Date.now },
        paymentMethod: { type: String, enum: ["Cash", "Online"], required: true },
        collectorName: { type: String }, // required if paymentMethod is Online
        screenshot: { type: String },      // Cloudinary URL for the uploaded screenshot
    },
    { timestamps: true }
);

module.exports = mongoose.model("CalendarPurchase", calendarPurchaseSchema);
