const express = require("express");
const router = express.Router();
const { getBanner, updateBanner } = require("../controller/eventBannerController");
const { upload } = require("../config/cloudinaryConfig");

router.get("/", getBanner);
router.put("/", upload.single("image"), updateBanner);

module.exports = router;
