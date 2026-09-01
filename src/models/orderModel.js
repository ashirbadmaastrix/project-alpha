const { pool: db } = require("../config/db");

const OrderModel = {
    async createOrder(orderData, items) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insert order
            const [orderResult] = await connection.query(
                `INSERT INTO pa_orders 
                 (user_id, total_amount, status, shipping_address, payment_method, payment_status)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    orderData.user_id,
                    orderData.total_amount,
                    orderData.status || 'received',
                    orderData.shipping_address,
                    orderData.payment_method || 'dummy',
                    orderData.payment_status || 'pending'
                ]
            );

            const orderId = orderResult.insertId;

            // Insert order items
            const itemValues = items.map(item => [
                orderId,
                item.product_id,
                item.quantity,
                item.price,
                item.weight_id || null
            ]);

            if (itemValues.length > 0) {
                await connection.query(
                    `INSERT INTO pa_order_items (order_id, product_id, quantity, price, weight_id)
                     VALUES ?`,
                    [itemValues]
                );
                
                // Deduct stock for each item
                for (let item of items) {
                    await connection.query(
                        `UPDATE pa_products 
                         SET current_stock = CAST(CAST(current_stock AS SIGNED) - ? AS CHAR) 
                         WHERE id = ?`,
                        [item.quantity, item.product_id]
                    );
                }
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async getOrderById(orderId) {
        const [orders] = await db.query(
            `SELECT * FROM pa_orders WHERE id = ? LIMIT 1`,
            [orderId]
        );
        if (orders.length === 0) return null;

        const order = orders[0];
        
        const [items] = await db.query(
            `SELECT 
                oi.*, 
                p.prod_name,
                c.name AS category_name,
                w.Qty AS weight_qty
             FROM pa_order_items oi
             LEFT JOIN pa_products p ON oi.product_id = p.id
             LEFT JOIN pa_categories c ON p.category_id = c.id
             LEFT JOIN pa_weights w ON oi.weight_id = w.id
             WHERE oi.order_id = ?`,
            [orderId]
        );
        order.items = items;
        return order;
    },

    async getOrdersByUserId(userId) {
        const [orders] = await db.query(
            `SELECT * FROM pa_orders WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );
        
        // Fetch items for each order
        for (let order of orders) {
            const [items] = await db.query(
                `SELECT 
                    oi.*, 
                    p.prod_name,
                    c.name AS category_name,
                    w.Qty AS weight_qty
                 FROM pa_order_items oi
                 LEFT JOIN pa_products p ON oi.product_id = p.id
                 LEFT JOIN pa_categories c ON p.category_id = c.id
                 LEFT JOIN pa_weights w ON oi.weight_id = w.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;
        }
        
        return orders;
    },

    async getAllOrders() {
        const [orders] = await db.query(
            `SELECT o.*, u.name as user_name, u.email as user_email
             FROM pa_orders o
             LEFT JOIN pa_users u ON o.user_id = u.user_id
             ORDER BY o.created_at DESC`
        );
        return orders;
    },

    async updateOrderStatus(orderId, status) {
        const [result] = await db.query(
            `UPDATE pa_orders SET status = ? WHERE id = ?`,
            [status, orderId]
        );
        return result;
    }
};

module.exports = OrderModel;
