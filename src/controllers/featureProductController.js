const FeatureProduct = require("../models/featureProductModel");


const CreateFeatureProduct = async (req, res) => {

    try {

        const { product_ids } = req.body;

        // Validate request
        if (!Array.isArray(product_ids) || product_ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "product_ids must be a non-empty array"
            });
        }


        // Remove duplicate IDs
        const uniqueProductIds = [...new Set(product_ids.map(Number))];


        // Check whether products exist
        const products = await FeatureProduct.getProductsByIds(
            uniqueProductIds
        );


        const existingProductIds = products.map(product => product.id);


        // Find invalid product IDs
        const invalidProductIds = uniqueProductIds.filter(
            id => !existingProductIds.includes(id)
        );


        if (invalidProductIds.length > 0) {
            return res.status(404).json({
                success: false,
                message: "Some products were not found",
                invalid_product_ids: invalidProductIds
            });
        }


        // Create featured products
        await FeatureProduct.createFeatureProducts(
            uniqueProductIds
        );


        return res.status(201).json({
            success: true,
            message: "Featured products created successfully",
            product_ids: uniqueProductIds
        });

    } catch (error) {

        console.error("Create Feature Product Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create featured products",
            error: error.message
        });
    }
};



const GetFeatureProducts = async (req, res) => {

    try {

        const products = await FeatureProduct.getFeatureProducts();

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {

        console.error("Get Feature Products Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get featured products",
            error: error.message
        });
    }
};


module.exports = {
    CreateFeatureProduct,
    GetFeatureProducts
};