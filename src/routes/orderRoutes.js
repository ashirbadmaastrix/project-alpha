const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

// User routes
router.post("/", authMiddleware, orderController.placeOrder);
router.get("/user", authMiddleware, orderController.getUserOrders);
router.get("/:id", authMiddleware, orderController.getOrderDetails);

// Admin routes (assuming authMiddleware distinguishes admin, or we just put it here for now. You might have an admin middleware to add)
router.get("/admin/all", authMiddleware, orderController.getAllOrdersAdmin);
router.put("/admin/:id/status", authMiddleware, orderController.updateOrderStatus);

module.exports = router;
