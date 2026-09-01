const bannerModel = require("../models/bannerModel");

// Create Banner
const createBanner = async (req, res) => {
    try {
        const {
            title,
            link,
            sort_order,
            status,
            position
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const img = req.file ? `/uploads/${req.file.filename}` : null;

        if (!img) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const result = await bannerModel.createBanner({
            title,
            img,
            link,
            sort_order,
            status,
            position
        });

        const banner = await bannerModel.getBannerById(result.insertId);

        return res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: banner
        });

    } catch (error) {
        console.error("Create Banner Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create banner",
            error: error.message
        });
    }
};

// Get All Banners
const getAllBanners = async (req, res) => {
    try {
        const banners = await bannerModel.getAllBanners();

        return res.status(200).json({
            success: true,
            message: "Banners fetched successfully",
            data: banners
        });

    } catch (error) {
        console.error("Get Banners Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch banners",
            error: error.message
        });
    }
};

// Get Banner By ID
const getBannerById = async (req, res) => {
    try {
        const { id } = req.params;

        const banner = await bannerModel.getBannerById(id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Banner fetched successfully",
            data: banner
        });

    } catch (error) {
        console.error("Get Banner Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch banner",
            error: error.message
        });
    }
};

// Update Banner
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const existingBanner = await bannerModel.getBannerById(id);

        if (!existingBanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        const data   = req.body;

        

        const updatedData = {
            title: data.title ?? existingBanner.title,
            img: req.file ? `/uploads/${req.file.filename}` : existingBanner.img,
            link: data.link ?? existingBanner.link,
            sort_order: data.sort_order ?? existingBanner.sort_order,
            status: data.status ?? existingBanner.status,
            position: data.position ?? existingBanner.position
        };

        await bannerModel.updateBanner(id, updatedData);

        const updatedBanner = await bannerModel.getBannerById(id);

        return res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: updatedBanner
        });

    } catch (error) {
        console.error("Update Banner Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update banner",
            error: error.message
        });
    }
};

// Delete Banner
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const existingBanner = await bannerModel.getBannerById(id);

        if (!existingBanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        await bannerModel.deleteBanner(id);

        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully"
        });

    } catch (error) {
        console.error("Delete Banner Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete banner",
            error: error.message
        });
    }
};

module.exports = {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner
};