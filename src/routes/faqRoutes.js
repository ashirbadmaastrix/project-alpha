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


// Create FAQ
router.post("/", createFAQ);

// Get all FAQs
router.get("/", getAllFAQs);

// Get FAQ by ID
router.get("/:id", getFAQById);

// Update FAQ
router.put("/:id", updateFAQ);

// Delete FAQ
router.delete("/:id", deleteFAQ);

// Update status
router.patch("/:id/status", updateFAQStatus);


module.exports = router;