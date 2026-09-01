const {pool: db} = require("../config/db");

// Create cart item
const createCart = async (data) => {
    const {
        user_id,
        product_id,
        weight_id,
        weight,
        quantity,
        price
    } = data;

    const sql = `
        INSERT INTO pa_cart
        (
            user_id,
            product_id,
            weight_id,
            weight,
            quantity,
            price
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
        user_id,
        product_id ||null,
        weight_id ||null,
        weight ||null,
        quantity||null ,
        price ||null
    ]);

    return result;
};


// Get all cart items
const getAllCarts = async () => {

    const sql = `
        SELECT
            c.id,
            c.user_id,
            c.product_id,
            p.prod_name,
            p.img,
            p.current_price,
            p.regular_price,
            p.mrp,
            p.availability,
            c.weight_id,
            c.weight,
            c.quantity,
            c.price,
            c.created_at,
            c.updated_at
        FROM pa_cart c
        LEFT JOIN pa_products p
            ON c.product_id = p.id
        ORDER BY c.created_at DESC
    `;

    const [rows] = await db.execute(sql);

    return rows;
};


// Get cart by ID
const getCartById = async (id) => {

    const sql = `
        SELECT
            c.id,
            c.user_id,
            c.product_id,
            p.prod_name,
            p.img,
            p.current_price,
            p.regular_price,
            p.mrp,
            p.availability,
            c.weight_id,
            c.weight,
            c.quantity,
            c.price,
            c.created_at,
            c.updated_at
        FROM pa_cart c
        LEFT JOIN pa_products p
            ON c.product_id = p.id
        WHERE c.id = ?
    `;

    const [rows] = await db.execute(sql, [id]);

    return rows[0];
};


// Get user's cart
const getCartByUserId = async (user_id) => {

    const sql = `
        SELECT
            c.id,
            c.user_id,
            c.product_id,
            p.prod_name,
            p.img,
            p.current_price,
            p.regular_price,
            p.mrp,
            p.availability,
            c.weight_id,
            c.weight,
            c.quantity,
            c.created_at,
            c.updated_at
        FROM pa_cart c
        LEFT JOIN pa_products p
            ON c.product_id = p.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
    `;

    const [rows] = await db.execute(sql, [user_id]);

    return rows;
};


// Update cart item   
const updateCart = async (id, data) => {

    const {
        product_id,
        weight_id,
        weight,
        quantity,
        price
    } = data;

    const sql = `
        UPDATE pa_cart
        SET
            product_id = ?,
            weight_id = ?,
            weight = ?,
            quantity = ?,
            price = ?
        WHERE id = ?
    `;

    const [result] = await db.execute(sql, [
        product_id,
        weight_id,
        weight,
        quantity,
        price,
        id
    ]);

    return result;
};


// Delete cart item
const deleteCart = async (id) => {

    const sql = `
        DELETE FROM pa_cart
        WHERE id = ?
    `;

    const [result] = await db.execute(sql, [id]);

    return result;
};


// Clear user's cart
const clearCart = async (user_id) => {

    const sql = `
        DELETE FROM pa_cart
        WHERE user_id = ?
    `;

    const [result] = await db.execute(sql, [user_id]);

    return result;
};


module.exports = {
    createCart,
    getAllCarts,
    getCartById,
    getCartByUserId,
    updateCart,
    deleteCart,
    clearCart
};