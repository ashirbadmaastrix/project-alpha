const { pool: db } = require("../config/db");
 
const User = {
    // Get user's wishlist
    async getWishlist(userId) {
        const [rows] = await db.query(
            `SELECT wishlist
       FROM pa_users
       WHERE user_id = ?
       LIMIT 1`,
            [userId]
        );
 
        return rows.length > 0 ? rows[0] : null;
    },
 
    // Update user's wishlist
    async updateWishlist(userId, wishlist) {
        const [result] = await db.query(
            `UPDATE pa_users
       SET wishlist = ?
       WHERE user_id = ?`,
            [JSON.stringify(wishlist), userId]
        );
 
        return result;
    },
    async findUserById(userId) {
        const [rows] = await db.query(
            `SELECT user_id, name, email, password, status, address
       FROM pa_users
       WHERE user_id = ?
       LIMIT 1`,
            [userId]
        );
 
        return rows.length > 0 ? rows[0] : null;
    },
 
    // Update user password
    async updatePassword(userId, hashedPassword) {
        const [result] = await db.query(
            `UPDATE pa_users
       SET password = ?
       WHERE user_id = ?`,
            [hashedPassword, userId]
        );
 
        return result;
    },

    async updateAddress(userId, address) {
        const [result] = await db.query(
            `UPDATE pa_users
       SET address = ?
       WHERE user_id = ?`,
            [JSON.stringify(address), userId]
        );
 
        return result;
    },

    async findUserByEmail(email) {
        const [rows] = await db.query(
            `SELECT
        user_id,
        name,
        email,
        password,
        status,
        password_reset_code,
        password_reset_expires_at
       FROM pa_users
       WHERE email = ?
       LIMIT 1`,
            [email]
        );
 
        return rows.length > 0 ? rows[0] : null;
    },
 
    async savePasswordResetCode(
        userId,
        resetCode,
        expiresAt
    ) {
        const [result] = await db.query(
            `UPDATE pa_users
       SET password_reset_code = ?,
           password_reset_expires_at = ?
       WHERE user_id = ?`,
            [resetCode, expiresAt, userId]
        );
 
        return result;
    },
 
    async resetPassword(userId, hashedPassword) {
        const [result] = await db.query(
            `UPDATE pa_users
       SET password = ?,
           password_reset_code = NULL,
           password_reset_expires_at = NULL
       WHERE user_id = ?`,
            [hashedPassword, userId]
        );
 
        return result;
    },

};
 
module.exports = User;