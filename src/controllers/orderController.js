const orderService = require("../services/orderService");

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.user_id; // from auth middleware
        const { items, payment_method, shipping_address } = req.body;

        if (!shipping_address) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }

        const orderId = await orderService.createOrder(userId, items, shipping_address, payment_method);
        
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId
        });
    } catch (error) {
        console.error("Place Order Error:", error);
        // Map common business logic errors to 400
        const msg = error.message.toLowerCase();
        if (msg.includes("address") || msg.includes("item") || msg.includes("invalid") || msg.includes("stock") || msg.includes("not found")) {
            const response = {
                success: false,
                message: error.message
            };
            
            if (error.product_id) {
                response.product_id = error.product_id;
            }
            
            return res.status(400).json(response);
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const orders = await orderService.getUserOrders(userId);
        
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get User Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderService.getOrderById(id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Get Order Details Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        await orderService.updateOrderStatus(id, status);
        
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully"
        });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        if (error.message.includes("Invalid")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get All Orders Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    placeOrder,
    getUserOrders,
    getOrderDetails,
    updateOrderStatus,
    getAllOrdersAdmin
};
