const {pool: db} = require("../config/db");

const FeatureProduct = {

    // Create featured products
    createFeatureProducts: async (productIds) => {

        const values = productIds.map((productId, index) => [
            productId,
            index
        ]);

        const query = `
            INSERT INTO pa_feature_products
            (product_id, sort_order)
            VALUES ?
        `;

        const [result] = await db.query(query, [values]);

        return result;
    },


    // Get all featured products
    getFeatureProducts: async () => {

        const query = `
            SELECT 
                fp.id,
                fp.product_id,
                fp.sort_order,
                fp.status,
                fp.created_at,
                fp.updated_at,

                p.prod_name,
                p.regular_price,
                p.current_price,
                p.mrp,
                p.availability,
                p.img,

                c.id AS category_id,
                c.category_name,

                w.id AS weight_id,
                w.Qty AS weight

            FROM pa_feature_products fp

            INNER JOIN pa_products p
                ON fp.product_id = p.id

            LEFT JOIN pa_categories c
                ON p.category_id = c.id

            LEFT JOIN pa_weight w
                ON p.weight = w.id

            WHERE fp.status = 1

            ORDER BY fp.sort_order ASC, fp.created_at DESC
        `;

        const [rows] = await db.query(query);

        return rows;
    },


    // Check whether products exist
    getProductsByIds: async (productIds) => {

        const placeholders = productIds.map(() => "?").join(",");

        const query = `
            SELECT id
            FROM pa_products
            WHERE id IN (${placeholders})
        `;

        const [rows] = await db.query(query, productIds);

        return rows;
    }
};

module.exports = FeatureProduct;