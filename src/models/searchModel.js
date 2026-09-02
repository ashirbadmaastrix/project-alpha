const { pool: db } = require("../config/db");

const searchProducts = async (search) => {
    const query = search.trim();
    const likeQuery = `%${query}%`;
    const startsWithQuery = `${query}%`;

    const [rows] = await db.execute(
        `SELECT
            p.*,
            c.name AS category_name,
            w.qty AS weight_value
         FROM pa_products p
         LEFT JOIN pa_categories c ON p.category_id = c.id
         LEFT JOIN pa_weights w ON p.weight_id = w.id
         WHERE p.prod_name LIKE ?
         ORDER BY
            CASE WHEN p.prod_name LIKE ? THEN 0 ELSE 1 END,
            p.prod_name ASC`,
        [likeQuery, startsWithQuery]
    );

    return rows;
};

module.exports = {
    searchProducts
};