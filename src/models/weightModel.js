const {pool :db } = require("../config/db");

const Weight = {
  // Get all weights
  getAll: async () => {
    const [rows] = await db.execute(
      `SELECT
        id,
        qty,
        status,
        created_at,
        updated_at
       FROM pa_weights
       ORDER BY id DESC`
    );

    return rows;
  },

  // Get weight by ID
  getById: async (id) => {
    const [rows] = await db.execute(
      `SELECT
        id,
        qty,
        status,
        created_at,
        updated_at
       FROM pa_weights
       WHERE id = ?`,
      [id]
    );

    return rows[0];
  },

  // Create weight
  create: async ({ qty, status = 1 }) => {
    const [result] = await db.execute(
      `INSERT INTO pa_weights
        (qty, status)
       VALUES (?, ?)`,
      [qty, status]
    );

    return result.insertId;
  },

  // Update weight
  update: async (id, { qty, status }) => {
    const [result] = await db.execute(
      `UPDATE pa_weights
       SET
        qty = ?,
        status = ?
       WHERE id = ?`,
      [qty, status, id]
    );

    return result;
  },

  // Delete weight
  delete: async (id) => {
    const [result] = await db.execute(
      `DELETE FROM pa_weights
       WHERE id = ?`,
      [id]
    );

    return result;
  },
};

module.exports = Weight;