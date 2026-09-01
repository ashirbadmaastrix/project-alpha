const { pool: db } = require("../config/db");

const findAdminByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT id, name, email, password, status, refresh_token
     FROM pa_admins
     WHERE email = ?`,
    [email]
  );

  return rows[0];
};

const findAdminById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, name, email, status, refresh_token
     FROM pa_admins
     WHERE id = ?`,
    [id]
  );

  return rows[0];
};

const findAdminByRefreshToken = async (token) => {
  const [rows] = await db.query(
    `SELECT id, name, email, status
     FROM pa_admins
     WHERE refresh_token = ?`,
    [token]
  );

  return rows[0];
};

const createAdmin = async (name, email, password) => {
  const [result] = await db.query(
    `INSERT INTO pa_admins (name, email, password)
     VALUES (?, ?, ?)`,
    [name, email, password]
  );

  return result.insertId;
};

const updateRefreshToken = async (adminId, token) => {
  await db.query(
    `UPDATE pa_admins SET refresh_token = ? WHERE id = ?`,
    [token, adminId]
  );
};

const findAdminPassword = async (id) => {
  const [rows] = await db.query(
    `SELECT id, name, email, password, status
     FROM pa_admins
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
 
  return rows.length > 0 ? rows[0] : null;
};
 
const updatePassword = async (id, hashedPassword) => {
  const [result] = await db.query(
    `UPDATE pa_admins
     SET password = ?
     WHERE id = ?`,
    [hashedPassword, id]
  );
 
  return result;
};

module.exports = {
  findAdminByEmail,
  findAdminById,
  findAdminByRefreshToken,
  createAdmin,
  updateRefreshToken,
  updatePassword,
  findAdminPassword
};