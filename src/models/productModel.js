const {pool: db} = require("../config/db");

const createSlug = (value) => value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const findProductBySlug = async (slug) => {
    const [rows] = await db.execute(
        `SELECT id, prod_name
         FROM pa_products
         WHERE LOWER(TRIM(BOTH '-' FROM REGEXP_REPLACE(TRIM(prod_name), '[^[:alnum:]]+', '-'))) = ?
         LIMIT 1`,
        [slug]
    );

    return rows[0];
};

// Create Product
const createProduct = async (productData) => {
    const {
        category_id,
        weight,
        prod_name,
        regular_price,
        current_price,
        mrp,
        availability,
        current_stock,
        img
    } = productData;

    const [result] = await db.execute(
        `INSERT INTO pa_products
        (
            category_id,
            weight_id,
            weight_qty,
            prod_name,
            regular_price,
            current_price,
            mrp,
            availability,
            current_stock,
            img
        )
        SELECT ?, w.id, w.qty, ?, ?, ?, ?, ?, ?, ?
        FROM pa_weights w
        WHERE w.id = ?`,
        [
            category_id,
            prod_name,
            regular_price,
            current_price,
            mrp,
            availability,
            current_stock,
            JSON.stringify(img || []),
            weight
        ]
    );

    return result;
};

// Get All Products
const getAllProducts = async () => {
    const [rows] = await db.execute(
        `SELECT 
            p.*,
            c.name AS category_name,
            w.qty AS weight_value
        FROM pa_products p
        LEFT JOIN pa_categories c 
            ON p.category_id = c.id
        LEFT JOIN pa_weights w 
            ON p.weight_id = w.id
        ORDER BY p.id DESC`
    );

    return rows;
};

// Get Product By ID
const getProductById = async (id) => {
    const [rows] = await db.execute(
        `SELECT 
            p.*,
            c.name AS category_name,
            w.qty AS weight_value
        FROM pa_products p
        LEFT JOIN pa_categories c 
            ON p.category_id = c.id
        LEFT JOIN pa_weights w 
            ON p.weight_id = w.id
        WHERE p.id = ?`,
        [id]
    );

    return rows[0];
};

// Update Product
const updateProduct = async (id, productData) => {
    const {
        category_id,
        weight_id,
        prod_name,
        regular_price,
        current_price,
        mrp,
        availability,
        current_stock,
        img
    } = productData;

    const [result] = await db.execute(
        `UPDATE pa_products p
        INNER JOIN pa_weights w ON w.id = ?
        SET
            p.category_id = ?,
            p.weight_id = w.id,
            p.weight_qty = w.qty,
            p.prod_name = ?,
            p.regular_price = ?,
            p.current_price = ?,
            p.mrp = ?,
            p.availability = ?,
            p.img = ?,
            p.updated_at = CURRENT_TIMESTAMP
        WHERE p.id = ?`,
        [
            weight_id,
            category_id,
            prod_name,
            regular_price,
            current_price,
            mrp,
            availability,
            current_stock,
            JSON.stringify(img || []),
            id
        ]
    );

    return result;
};

// Delete Product
const deleteProduct = async (id) => {
    const [result] = await db.execute(
        `DELETE FROM pa_products WHERE id = ?`,
        [id]
    );

    return result;
};

module.exports = {
    createSlug,
    findProductBySlug,
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};