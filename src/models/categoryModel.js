const { pool: db } = require("../config/db");


const Category = {
  // Get categories without a parent category
  getRootCategories: async () => {
    const [rows] = await db.execute(
      `SELECT
        id,
        name,
        parent_category,
        img_path,
        status,
        (SELECT COUNT(*) FROM pa_products p WHERE p.category_id = pa_categories.id) AS product_count,
        created_at,
        updated_at
       FROM pa_categories
       WHERE parent_category IS NULL
       ORDER BY id DESC`
    );

    return rows;
  },

  // Get categories by parent category
  getByParentCategory: async (parentCategoryName) => {
    const [rows] = await db.execute(
      `SELECT
        id,
        name,
        parent_category,
        img_path,
        status,
        (SELECT COUNT(*) FROM pa_products p WHERE p.category_id = pa_categories.id) AS product_count,
        created_at,
        updated_at
       FROM pa_categories
       WHERE parent_category = ?
       ORDER BY id DESC`,
      [parentCategoryName]
    );

    return rows;
  },

  // Get a category by name
  getByName: async (name) => {
    const [rows] = await db.execute(
      `SELECT
        id,
        name,
        parent_category,
        img_path,
        status,
        (SELECT COUNT(*) FROM pa_products p WHERE p.category_id = pa_categories.id) AS product_count,
        created_at,
        updated_at
       FROM pa_categories
       WHERE name = ?
       LIMIT 1`,
      [name]
    );

    return rows[0];
  },

  // Get all categories
  getAll: async () => {
    const [rows] = await db.execute(
      `SELECT 
        id,
        name,
        parent_category,
        img_path,
        status,
        (SELECT COUNT(*) FROM pa_products p WHERE p.category_id = pa_categories.id) AS product_count,
        created_at,
        updated_at
       FROM pa_categories
       ORDER BY id DESC`
    );

    return rows;
  },

  // Get category by ID
  getById: async (id) => {
    const [rows] = await db.execute(
      `SELECT 
        id,
        name,
        parent_category,
        img_path,
        status,
        (SELECT COUNT(*) FROM pa_products p WHERE p.category_id = pa_categories.id) AS product_count,
        created_at,
        updated_at
       FROM pa_categories
       WHERE id = ?`,
      [id]
    );

    return rows[0];
  },

  // Create category
  create: async ({ name, parent_category = null, img_path, status = 1 }) => {
    const [result] = await db.execute(
      `INSERT INTO pa_categories 
        (name, parent_category, img_path, status)
       VALUES (?, ?, ?, ?)`,
      [name, parent_category, img_path || null, status]
    );

    return result.insertId;
  },

  // Update category
  update: async (id, { name, parent_category, img_path, status }) => {
    const [result] = await db.execute(
      `UPDATE pa_categories
       SET
         name = ?,
         parent_category = ?,
         img_path = ?,
         status = ?
       WHERE id = ?`,
      [name, parent_category, img_path || null, status, id]
    );

    return result;
  },

  // Delete category
  delete: async (id) => {
    const [result] = await db.execute(
      `DELETE FROM pa_categories
       WHERE id = ?`,
      [id]
    );

    return result;
  },
  subcategory : async (data) => {
  const {
    name,
    parent_category,
    img_path,
    status = 1,
  } = data;

  const query = `
    INSERT INTO pa_categories
    (
      name,
      img_path,
      status,
      parent_category
    )
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    name,
    img_path,
    status,
    parent_category,
  ]);

  return result.insertId;
  },
};

module.exports = Category;