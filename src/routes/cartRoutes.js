const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require ("../middlewares/adminMiddleware")

// Add product to cart
router.post(
    "/",authMiddleware,
    cartController.createCart
);


// Get all cart items
router.get(
    "/",authMiddleware,adminMiddleware,
    cartController.getAllCarts
);


// Get cart by user
router.get(
    "/user/:user_id",authMiddleware,
    cartController.getCartByUserId
);


// Get cart item by ID
router.get(
    "/:id",
    cartController.getCartById
);


// Update cart item
router.put(
    "/:id",
    cartController.updateCart
);


// Delete cart item
router.delete(
    "/:id",authMiddleware,adminMiddleware,
    cartController.deleteCart
);


// Clear user's cart
router.delete(
    "/user/:user_id/clear",
    cartController.clearCart
);


module.exports = router;