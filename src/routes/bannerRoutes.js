const express = require("express");

const router = express.Router();

const bannerController = require("../controllers/bannerController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Create Banner
router.post("/create",authMiddleware,adminMiddleware,upload.single("image"),bannerController.createBanner);

// Get All Banners
router.get("/all", bannerController.getAllBanners);

// Get Banner By ID
router.get("/:id", bannerController.getBannerById);

// Update Banner
router.put("/:id",authMiddleware,adminMiddleware,upload.single("image"), bannerController.updateBanner);

// Delete Banner
router.delete("/:id",authMiddleware,adminMiddleware, bannerController.deleteBanner);

module.exports = router;