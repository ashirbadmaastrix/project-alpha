const {pool:    db} = require("../config/db");

// Create contact
const createContact = async (data) => {
    const {
        name,
        email,
        phone,
        subject,
        message
    } = data;

    const sql = `
        INSERT INTO pa_contacts
        (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
        name,
        email,
        phone || null,
        subject || null,
        message
    ]);

    return result;
};


// Get all contacts
const getAllContacts = async () => {

    const sql = `
        SELECT *
        FROM pa_contacts
        ORDER BY created_at DESC
    `;

    const [rows] = await db.execute(sql);

    return rows;
};


// Get contact by ID
const getContactById = async (id) => {

    const sql = `
        SELECT *
        FROM pa_contacts
        WHERE id = ?
    `;

    const [rows] = await db.execute(sql, [id]);

    return rows[0];
};


// Update contact
const updateContact = async (id, data) => {

    const {
        name,
        email,
        phone,
        subject,
        message,
        status
    } = data;

    const sql = `
        UPDATE pa_contacts
        SET
            name = ?,
            email = ?,
            phone = ?,
            subject = ?,
            message = ?,
            status = ?
        WHERE id = ?
    `;

    const [result] = await db.execute(sql, [
        name,
        email,
        phone || null,
        subject || null,
        message,
        status,
        id
    ]);

    return result;
};


// Delete contact
const deleteContact = async (id) => {

    const sql = `
        DELETE FROM pa_contacts
        WHERE id = ?
    `;

    const [result] = await db.execute(sql, [id]);

    return result;
};


module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
};