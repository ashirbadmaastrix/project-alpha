const Product = require("../models/productModel");

// Create Product
const createProduct = async (req, res) => {
    try {
        const {
            category_id,
            weight,
            prod_name,
            prod_description,
            regular_price,
            current_price,
            mrp,
            availability,
            current_stock,
        } = req.body;

        if (!category_id || !weight || !prod_name) {
            return res.status(400).json({
                success: false,
                message: "category_id, weight and prod_name are required"
            });
        }

        const productSlug = Product.createSlug(prod_name);
        const existingProduct = await Product.findProductBySlug(productSlug);

        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: "Already have product with this name"
            });
        }

        const images = req.files
            ? req.files.map(file => `/uploads/${file.filename}`)
            : [];

        const result = await Product.createProduct({
            category_id,
            weight,
            prod_name,
            prod_description,
            regular_price,
            current_price,
            mrp,
            availability,
            current_stock,
            img: images
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Weight not found"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: {
                id: result.insertId,
                weight_id: weight,
                images
            }
        });

    } catch (error) {
        console.error("Create Product Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
};

// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.getAllProducts();

        const formattedProducts = products.map(product => ({
            ...product,
            img: product.img ? JSON.parse(product.img) : []
        }));

        return res.status(200).json({
            success: true,
            data: formattedProducts
        });

    } catch (error) {
        console.error("Get Products Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};

// Get Product By ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.img = product.img
            ? JSON.parse(product.img)
            : [];

        return res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error("Get Product Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct = await Product.getProductById(id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const {
            category_id,
            weight_id: requestedWeightId,
            prod_name,
            prod_description,
            regular_price,
            current_price,
            mrp,
            availability,
            current_stock
        } = req.body;
        const weight_id = requestedWeightId ?? req.body.weight;

        // If new images are uploaded, replace old images.
        // Otherwise keep existing images.
        let images = existingProduct.img
            ? JSON.parse(existingProduct.img)
            : [];
            

        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/${file.filename}`);
        }

        await Product.updateProduct(id, {
            category_id,
            weight_id,
            prod_name,
            prod_description,
            regular_price,
            current_price,
            mrp,
            availability,
            img: images
        });

        return res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });

    } catch (error) {
        console.error("Update Product Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update product"
        });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct = await Product.getProductById(id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await Product.deleteProduct(id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete Product Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};