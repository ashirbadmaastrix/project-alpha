const {pool: db} = require("../config/db");

// const getOrderItems = async (bulkOrderId) => {
//     const [rows] = await db.execute(
//         `SELECT *
//          FROM pa_bulk_order_items
//          WHERE bulk_order_id = ?
//          ORDER BY id ASC`,
//         [bulkOrderId]
//     );

//     return rows;
// };

const getOrderItems = async (bulkOrderId) => {
    const query = `
        SELECT 
            boi.id,
            boi.bulk_order_id,
            boi.quantity,

            boi.product_id,
            p.prod_name AS product_name,
            p.prod_description AS product_description,
            p.img AS product_img,
            boi.category_id,
            c.name AS category_name,

            boi.weight_id,
            w.Qty AS weight_qty,

            boi.created_at

        FROM pa_bulk_order_items boi

        LEFT JOIN pa_products p 
            ON boi.product_id = p.id

        LEFT JOIN pa_categories c 
            ON boi.category_id = c.id

        LEFT JOIN pa_weights w 
            ON boi.weight_id = w.id

        WHERE boi.bulk_order_id = ?

        ORDER BY boi.id ASC
    `;

    const [rows] = await db.query(query, [bulkOrderId]);

    return rows;
};

const saveOrderItems = async (bulkOrderId, items) => {
    if (!items.length) {
        await db.execute(
            `DELETE FROM pa_bulk_order_items WHERE bulk_order_id = ?`,
            [bulkOrderId]
        );
        return;
    }

    const productIds = items.map((item) => item.product_id);
    const [products] = await db.query(
        `SELECT id, category_id
         FROM pa_products
         WHERE id IN (?)`,
        [productIds]
    );
    const productsById = new Map(products.map((product) => [String(product.id), product]));
    const missingProductIds = productIds.filter(
        (productId) => !productsById.has(String(productId))
    );

    if (missingProductIds.length > 0) {
        const error = new Error(
            `Invalid product_id value(s): ${missingProductIds.join(", ")}`
        );
        error.statusCode = 400;
        throw error;
    }

    await db.execute(
        `DELETE FROM pa_bulk_order_items WHERE bulk_order_id = ?`,
        [bulkOrderId]
    );

    const values = items.map((item) => [
        bulkOrderId,
        item.product_id ?? null,
        productsById.get(String(item.product_id))?.category_id ?? null,
        item.quantity ?? null,
        item.weight_id ?? null
    ]);

    await db.query(
        `INSERT INTO pa_bulk_order_items
            (bulk_order_id, product_id, category_id, quantity, weight_id)
         VALUES ?`,
        [values]
    );
};

// Create a new bulk order draft
const createBulkOrder = async (data) => {
    const {
        session_id,
        current_step = 1,
        name = null,
        email = null,
        phone = null,
        company_name = null,
        address = null,
        city = null,
        state = null,
        pincode = null,
        requirements = null,
        preferred_delivery_date = null, 
        status = "draft",
        items = []
    } = data;

    const query = `
        INSERT INTO pa_bulk_orders (
            session_id,
            current_step,
            name,
            email,
            phone,
            company_name,
            address,
            city,
            state,
            pincode,
            requirements,
            preferred_delivery_date,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        session_id,
        current_step,
        name,
        email,
        phone,
        company_name,
        address,
        city,
        state,
        pincode,
        requirements,
        preferred_delivery_date,
        status
    ];

    const [result] = await db.query(query, values);

    await saveOrderItems(result.insertId, items);

    return result.insertId;
};


// Get bulk order by ID
const getBulkOrderById = async (id) => {
    const query = `
        SELECT *
        FROM pa_bulk_orders
        WHERE id = ?
        LIMIT 1
    `;

    const [rows] = await db.query(query, [id]);

    if (!rows[0]) return undefined;

    rows[0].items = await getOrderItems(id);
    return rows[0];
};


// Get bulk order by session ID
const getBulkOrderBySessionId = async (session_id) => {
    const query = `
        SELECT *
        FROM pa_bulk_orders
        WHERE session_id = ?
        LIMIT 1
    `;

    const [rows] = await db.query(query, [session_id]);

    if (!rows[0]) return undefined;

    rows[0].items = await getOrderItems(rows[0].id);
    return rows[0];
};


// Update bulk order draft
const updateBulkOrder = async (session_id, data) => {

    const allowedFields = [
        "current_step",
        "name",
        "email",
        "phone",
        "company_name",
        "address",
        "city",
        "state",
        "pincode",
        "requirements",
        "preferred_delivery_date",
        "status"
    ];

    const fields = [];
    const values = [];

    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            fields.push(`${field} = ?`);
            values.push(data[field]);
        }
    });

    if (fields.length === 0 && data.items === undefined) {
        return false;
    }

    if (fields.length > 0) {
        values.push(session_id);
    }

    let result = { affectedRows: 0 };

    if (fields.length > 0) {
        const query = `
            UPDATE pa_bulk_orders
            SET ${fields.join(", ")}
            WHERE session_id = ?
        `;

        [result] = await db.query(query, values);
    }

    if (data.items !== undefined) {
        const order = await getBulkOrderBySessionId(session_id);
        await saveOrderItems(order.id, data.items);
    }

    return result.affectedRows > 0 || data.items !== undefined;
};


// Submit bulk order
const submitBulkOrder = async (session_id) => {

    const query = `
        UPDATE pa_bulk_orders
        SET
            status = 'submitted',
            current_step = 4
        WHERE session_id = ?
          AND status = 'draft'
    `;

    const [result] = await db.query(query, [session_id]);

    return result.affectedRows > 0;
};


// Cancel bulk order
const cancelBulkOrder = async (session_id) => {

    const query = `
        UPDATE pa_bulk_orders
        SET status = 'cancelled'
        WHERE session_id = ?
    `;

    const [result] = await db.query(query, [session_id]);

    return result.affectedRows > 0;
};


// Get all submitted/draft bulk orders
const getAllBulkOrders = async () => {

    const query = `
        SELECT *
        FROM pa_bulk_orders
        ORDER BY created_at DESC
    `;

    const [rows] = await db.query(query);

    for (const row of rows) {
        row.items = await getOrderItems(row.id);
    }

    return rows;
};


module.exports = {
    createBulkOrder,
    getBulkOrderById,
    getBulkOrderBySessionId,
    updateBulkOrder,
    submitBulkOrder,
    cancelBulkOrder,
    getAllBulkOrders
};