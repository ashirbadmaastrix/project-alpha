const productModel = require("../models/searchModel");

const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const products = await productModel.searchProducts(q);

        return res.status(200).json({
            success: true,
            message: "Products searched successfully",
            search: q.trim(),
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error("Search Products Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to search products",
            error: error.message
        });
    }
};

module.exports = {
    searchProducts
};