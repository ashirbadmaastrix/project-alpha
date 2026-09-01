const crypto = require("crypto");
const { pool: db } = require("../config/db");

const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM pa_users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0];
};

const createUser = async (name, email, password) => {
  const userId = crypto.randomUUID();

  await db.execute(
    `INSERT INTO pa_users
      (user_id, name, email, password)
     VALUES (?, ?, ?, ?)`,
    [userId, name, email, password]
  );

  return userId;
};

const changeUserStatus = async (status,user_id) => {
    await db.execute(`UPDTAE pa_user set status = ? WHERE user_id = ?`,(status,user_id))
}


module.exports = {
  findUserByEmail,
  createUser,
};