const express = require("express");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");


const router = express.Router();

// Create Product
router.post(
    "/create",authMiddleware,adminMiddleware,
    upload.array("img", 10),
    createProduct
);

// Get All Products
router.get(
    "/",
    getProducts
);

// Get Product By ID
router.get(
    "/:id",
    getProductById
);

// Update Product
router.put(
    "/:id",authMiddleware,adminMiddleware,
    upload.array("img", 10),
    updateProduct
);

// Delete Product
router.delete(
    "/:id",
    deleteProduct
);

module.exports = router;