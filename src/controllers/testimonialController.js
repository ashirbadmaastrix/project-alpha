const testimonialModel = require("../models/testimonialModel");

const createTestimonial = async (req, res) => {
    try {
        const { name, designation, testimonials } = req.body;

        if (!name || !testimonials) {
            return res.status(400).json({
                success: false,
                message: "Name and testimonial are required"
            });
        }

        const img = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const testimonialId = await testimonialModel.createTestimonial({
            name,
            img,
            designation,
            testimonials
        });

        const testimonial =
            await testimonialModel.getTestimonialById(testimonialId);

        return res.status(201).json({
            success: true,
            message: "Testimonial created successfully",
            data: testimonial
        });

    } catch (error) {
        console.error("Create Testimonial Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const getAllTestimonials = async (req, res) => {
    try {
        const testimonials =
            await testimonialModel.getAllTestimonials();

        return res.status(200).json({
            success: true,
            message: "Testimonials fetched successfully",
            data: testimonials
        });

    } catch (error) {
        console.error("Get Testimonials Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;

        const testimonial =
            await testimonialModel.getTestimonialById(id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Testimonial fetched successfully",
            data: testimonial
        });

    } catch (error) {
        console.error("Get Testimonial Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const existingTestimonial =
            await testimonialModel.getTestimonialById(id);

        if (!existingTestimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        const { name, designation, testimonials } = req.body;

        const updatedData = {
            name: name ?? existingTestimonial.name,
            designation: designation ?? existingTestimonial.designation,
            testimonials: testimonials ?? existingTestimonial.testimonials,
            img: req.file
                ? `/uploads/${req.file.filename}`
                : existingTestimonial.img
        };

        await testimonialModel.updateTestimonial(id, updatedData);

        const updatedTestimonial =
            await testimonialModel.getTestimonialById(id);

        return res.status(200).json({
            success: true,
            message: "Testimonial updated successfully",
            data: updatedTestimonial
        });

    } catch (error) {
        console.error("Update Testimonial Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        const existingTestimonial =
            await testimonialModel.getTestimonialById(id);

        if (!existingTestimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        await testimonialModel.deleteTestimonial(id);

        return res.status(200).json({
            success: true,
            message: "Testimonial deleted successfully"
        });

    } catch (error) {
        console.error("Delete Testimonial Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
};