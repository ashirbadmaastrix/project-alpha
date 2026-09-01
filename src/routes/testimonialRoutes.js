const express = require("express");
const router = express.Router();

const testimonialController = require("../controllers/testimonialController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/create",
  authMiddleware,
  upload.single("img"),
  testimonialController.createTestimonial,
);

router.get("/", testimonialController.getAllTestimonials);

router.get("/:id", testimonialController.getTestimonialById);

router.put(
  "/:id",
  authMiddleware,
  upload.single("img"),
  testimonialController.updateTestimonial,
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  testimonialController.deleteTestimonial,
);

module.exports = router;
