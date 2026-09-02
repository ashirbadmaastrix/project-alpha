const express = require("express");

const router = express.Router();

const {
    createFAQ,
    getAllFAQs,
    getFAQById,
    updateFAQ,
    deleteFAQ,
    updateFAQStatus
} = require("../controllers/faqController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");


// Create FAQ
router.post("/",authMiddleware,adminMiddleware, createFAQ);

// Get all FAQs
router.get("/", getAllFAQs);

// Get FAQ by ID
router.get("/:id", getFAQById);

// Update FAQ
router.put("/:id", authMiddleware, adminMiddleware, updateFAQ);

// Delete FAQ
router.delete("/:id", authMiddleware, adminMiddleware, deleteFAQ);

// Update status
router.patch("/:id/status", authMiddleware, adminMiddleware, updateFAQStatus);


module.exports = router;