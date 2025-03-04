const ContactBanner = require("../models/ContactBanner");

exports.getContactBanner = async (req, res) => {
  try {
    const banner = await ContactBanner.findOne();
    res.status(200).json(banner || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contact banner" });
  }
};

exports.uploadContactBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = req.file.path;
    const title = req.body.title || "";

    let banner = await ContactBanner.findOne();
    if (!banner) {
      banner = new ContactBanner({ title, image: imageUrl });
    } else {
      banner.title = title;
      banner.image = imageUrl;
    }
    await banner.save();
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload contact banner" });
  }
};
