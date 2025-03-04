// config/cloudinaryConfig.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1) Storage for contact banners
const contactBannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "contactBanners",
        resource_type: "auto", // Allows images/PDF/other
        allowed_formats: ["jpg", "jpeg", "png"], // Only accept these formats
    },
});
const contactBannerUpload = multer({ storage: contactBannerStorage });

// 2) Storage for generic banner images
const bannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "banners",
        resource_type: "auto",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const bannerUpload = multer({ storage: bannerStorage });

// 3) Storage for calendar images
const calendarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "calendars",
        resource_type: "auto",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const calendarUpload = multer({ storage: calendarStorage });

// 4) Default storage for generic uploads (e.g., announcements, books, etc.)
const defaultStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "default",
        resource_type: "auto",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});
const upload = multer({ storage: defaultStorage });

// 5) Storage for Event Calendar PDF files
const eventCalendarPdfStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "eventCalendarPdfs",
        resource_type: "auto", // So it can handle PDFs
        allowed_formats: ["pdf"],
    },
});
const eventCalendarPdfUpload = multer({ storage: eventCalendarPdfStorage });

// 6) Storage for Event Calendar Banner images
const eventCalendarBannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "eventCalendarBanners",
        resource_type: "auto",
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
