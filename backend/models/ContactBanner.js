const mongoose = require("mongoose");

const contactBannerSchema = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: String }, // URL to the uploaded banner image
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactBanner", contactBannerSchema);
