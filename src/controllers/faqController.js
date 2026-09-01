const FAQ = require("../models/faqModel");


// Create FAQ
const createFAQ = async (req, res) => {

    try {

        const {
            question,
            answer,
            status = 1,
            sort_order = 0
        } = req.body;

        // Validation
        if (!question || !answer) {
            return res.status(400).json({
                success: false,
                message: "Question and answer are required"
            });
        }

        const faqId = await FAQ.createFAQ({
            question,
            answer,
            status,
            sort_order
        });

        const faq = await FAQ.getFAQById(faqId);

        return res.status(201).json({
            success: true,
            message: "FAQ created successfully",
            data: faq
        });

    } catch (error) {

        console.error("Create FAQ Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create FAQ",
            error: error.message
        });
    }
};


// Get all FAQs
const getAllFAQs = async (req, res) => {

    try {

        const faqs = await FAQ.getAllFAQs();

        return res.status(200).json({
            success: true,
            count: faqs.length,
            data: faqs
        });

    } catch (error) {

        console.error("Get FAQs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get FAQs",
            error: error.message
        });
    }
};


// Get FAQ by ID
const getFAQById = async (req, res) => {

    try {

        const { id } = req.params;

        const faq = await FAQ.getFAQById(id);

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: faq
        });

    } catch (error) {

        console.error("Get FAQ Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get FAQ",
            error: error.message
        });
    }
};


// Update FAQ
const updateFAQ = async (req, res) => {

    try {

        const { id } = req.params;

        const existingFAQ = await FAQ.getFAQById(id);

        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found"
            });
        }

        const {
            question,
            answer,
            status,
            sort_order
        } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                success: false,
                message: "Question and answer are required"
            });
        }

        await FAQ.updateFAQ(id, {
            question,
            answer,
            status,
            sort_order
        });

        const updatedFAQ = await FAQ.getFAQById(id);

        return res.status(200).json({
            success: true,
            message: "FAQ updated successfully",
            data: updatedFAQ
        });

    } catch (error) {

        console.error("Update FAQ Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update FAQ",
            error: error.message
        });
    }
};


// Delete FAQ
const deleteFAQ = async (req, res) => {

    try {

        const { id } = req.params;

        const existingFAQ = await FAQ.getFAQById(id);

        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found"
            });
        }

        await FAQ.deleteFAQ(id);

        return res.status(200).json({
            success: true,
            message: "FAQ deleted successfully"
        });

    } catch (error) {

        console.error("Delete FAQ Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete FAQ",
            error: error.message
        });
    }
};


// Update FAQ status
const updateFAQStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        if (status !== 0 && status !== 1) {
            return res.status(400).json({
                success: false,
                message: "Status must be 0 or 1"
            });
        }

        const existingFAQ = await FAQ.getFAQById(id);

        if (!existingFAQ) {
            return res.status(404).json({
                success: false,
                message: "FAQ not found"
            });
        }

        await FAQ.updateFAQStatus(id, status);

        const updatedFAQ = await FAQ.getFAQById(id);

        return res.status(200).json({
            success: true,
            message: "FAQ status updated successfully",
            data: updatedFAQ
        });

    } catch (error) {

        console.error("Update FAQ Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update FAQ status",
            error: error.message
        });
    }
};


module.exports = {
    createFAQ,
    getAllFAQs,
    getFAQById,
    updateFAQ,
    deleteFAQ,
    updateFAQStatus
};