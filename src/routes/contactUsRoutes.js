const express = require("express");

const router = express.Router();

const contactController = require("../controllers/contactUsController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");


// Create contact
router.post(
    "/",
    contactController.createContact
);


// Get all contacts
router.get(
    "/",authMiddleware,adminMiddleware,
    contactController.getAllContacts
);


// Get contact by ID
router.get(
    "/:id",authMiddleware,adminMiddleware,
    contactController.getContactById
);


// Update contact
router.put(
    "/:id",authMiddleware,adminMiddleware,
    contactController.updateContact
);


// Delete contact
router.delete(
    "/:id",authMiddleware,adminMiddleware,
    contactController.deleteContact
);


module.exports = router;