const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const OrderService = {
    async createOrder(userId, items, shippingAddress, paymentMethod = 'dummy') {
        // Validate user
        const user = await userModel.findUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        if (!shippingAddress) {
            throw new Error("Shipping address is required to place an order");
        }

        if (!items || items.length === 0) {
            throw new Error("Order must contain at least one item");
        }

        // Check stock and calculate total amount
        let totalAmount = 0;
        for (let item of items) {
            if (!item.product_id || !item.quantity) {
                throw new Error("Invalid item format in order");
            }
            
            const product = await productModel.getProductById(item.product_id);
            if (!product) {
                const err = new Error(`Product ID ${item.product_id} not found`);
                err.product_id = item.product_id;
                throw err;
            }
            
            const stock = parseInt(product.current_stock, 10) || 0;
            if (stock < item.quantity) {
                const err = new Error(`Out of stock for product: ${product.prod_name}`);
                err.product_id = item.product_id;
                throw err;
            }

            // Using the price passed by the client for now (as per original logic), but validating format
            if (!item.price) {
                throw new Error("Invalid item format in order");
            }
            totalAmount += item.price * item.quantity;
        }

        const orderData = {
            user_id: userId,
            total_amount: totalAmount,
            status: 'received',
            shipping_address: typeof shippingAddress === 'object' ? JSON.stringify(shippingAddress) : shippingAddress,
            payment_method: paymentMethod,
            payment_status: 'pending' // For dummy, keep pending. Razorpay webhook would update this later.
        };

        const orderId = await orderModel.createOrder(orderData, items);
        return orderId;
    },

    async getUserOrders(userId) {
        return await orderModel.getOrdersByUserId(userId);
    },

    async getOrderById(orderId) {
        return await orderModel.getOrderById(orderId);
    },

    async getAllOrders() {
        return await orderModel.getAllOrders();
    },

    async updateOrderStatus(orderId, status) {
        const validStatuses = ['received', 'packaging', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid order status");
        }
        return await orderModel.updateOrderStatus(orderId, status);
    }
};

module.exports = OrderService;
