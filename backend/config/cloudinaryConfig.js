const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Existing storage for contact banners
const contactBannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "contactBanners",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const contactBannerUpload = multer({ storage: contactBannerStorage });

// Storage for generic banner images (stored in "banners" folder)
const bannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "banners",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const bannerUpload = multer({ storage: bannerStorage });

// Storage for calendar images (stored in "calendars" folder)
const calendarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "calendars",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const calendarUpload = multer({ storage: calendarStorage });

// Default storage for generic uploads (e.g., announcements or book management)
const defaultStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "default",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const upload = multer({ storage: defaultStorage });

// New storage for Event Calendar PDF files (stored in "eventCalendarPdfs" folder)
const eventCalendarPdfStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "eventCalendarPdfs",
        allowed_formats: ["pdf"],
    },
});
const eventCalendarPdfUpload = multer({ storage: eventCalendarPdfStorage });

// New storage for Event Calendar Banner images (stored in "eventCalendarBanners" folder)
const eventCalendarBannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "eventCalendarBanners",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const eventCalendarBannerUpload = multer({ storage: eventCalendarBannerStorage });

// Export all middlewares
module.exports = {
    bannerUpload,
    calendarUpload,
    upload,
    contactBannerUpload,
    eventCalendarPdfUpload,
    eventCalendarBannerUpload,
};
