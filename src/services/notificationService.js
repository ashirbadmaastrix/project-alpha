const { pool } = require('../config/db');

const VALID_NOTIFICATION_TYPES = ['order', 'payment', 'bulk_order', 'offer', 'system'];

const normalizeNotificationType = (type) => {
    if (!type || !VALID_NOTIFICATION_TYPES.includes(type)) {
        return 'system';
    }
    return type;
};

const NotificationService = {
    async createNotification({
        user_id,
        title,
        message,
        type = 'system',
        reference_id = null,
        reference_type = null,
    }) {
        if (!title || !String(title).trim()) {
            throw new Error('Notification title is required');
        }

        if (!message || !String(message).trim()) {
            throw new Error('Notification message is required');
        }

        const safeType = normalizeNotificationType(type);

        const [result] = await pool.execute(
            `INSERT INTO pa_notifications (
                user_id,
                title,
                message,
                type,
                reference_id,
                reference_type,
                is_read,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
            [
                user_id ?? null,
                String(title).trim(),
                String(message).trim(),
                safeType,
                reference_id ?? null,
                reference_type ?? null,
            ]
        );

        return {
            id: result.insertId,
            user_id: user_id ?? null,
            title: String(title).trim(),
            message: String(message).trim(),
            type: safeType,
            reference_id: reference_id ?? null,
            reference_type: reference_type ?? null,
            is_read: 0,
        };
    },

    async getUserNotifications(user_id, { limit = 20, offset = 0, unreadOnly = false } = {}) {
        if (!user_id) {
            throw new Error('user_id is required');
        }

        let query = 'SELECT * FROM pa_notifications WHERE user_id = ?';
        const params = [user_id];

        if (unreadOnly) {
            query += ' AND is_read = 0';
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(Number(limit), Number(offset));

        const [rows] = await pool.execute(query, params);
        return rows;
    },

    async getUnreadCount(user_id) {
        if (!user_id) {
            throw new Error('user_id is required');
        }

        const [rows] = await pool.execute(
            'SELECT COUNT(*) AS unread_count FROM pa_notifications WHERE user_id = ? AND is_read = 0',
            [user_id]
        );

        return Number(rows[0]?.unread_count || 0);
    },

    async markAsRead(notification_id, user_id = null) {
        if (!notification_id) {
            throw new Error('notification_id is required');
        }

        let query = 'UPDATE pa_notifications SET is_read = 1 WHERE id = ?';
        const params = [notification_id];

        if (user_id) {
            query += ' AND user_id = ?';
            params.push(user_id);
        }

        const [result] = await pool.execute(query, params);
        return result.affectedRows > 0;
    },

    async markAllAsRead(user_id) {
        if (!user_id) {
            throw new Error('user_id is required');
        }

        const [result] = await pool.execute(
            'UPDATE pa_notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
            [user_id]
        );

        return result.affectedRows;
    },
};

module.exports = NotificationService;
