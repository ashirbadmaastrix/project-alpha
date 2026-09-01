const {pool: db} = require("../config/db");


// Create FAQ
const createFAQ = async (data) => {
    const { question, answer, status = 1, sort_order = 0 } = data;

    const query = `
        INSERT INTO pa_faqs
        (question, answer, status, sort_order)
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
        question,
        answer,
        status,
        sort_order
    ]);

    return result.insertId;
};


// Get all FAQs
const getAllFAQs = async () => {

    const query = `
        SELECT *
        FROM pa_faqs
        ORDER BY sort_order ASC, created_at DESC
    `;

    const [rows] = await db.query(query);

    return rows;
};


// Get FAQ by ID
const getFAQById = async (id) => {

    const query = `
        SELECT *
        FROM pa_faqs
        WHERE id = ?
    `;

    const [rows] = await db.query(query, [id]);

    return rows[0];
};


// Update FAQ
const updateFAQ = async (id, data) => {

    const { question, answer, status, sort_order } = data;

    const query = `
        UPDATE pa_faqs
        SET
            question = ?,
            answer = ?,
            status = ?,
            sort_order = ?
        WHERE id = ?
    `;

    const [result] = await db.query(query, [
        question,
        answer,
        status,
        sort_order,
        id
    ]);

    return result;
};


// Delete FAQ
const deleteFAQ = async (id) => {

    const query = `
        DELETE FROM pa_faqs
        WHERE id = ?
    `;

    const [result] = await db.query(query, [id]);

    return result;
};


// Update FAQ status
const updateFAQStatus = async (id, status) => {

    const query = `
        UPDATE pa_faqs
        SET status = ?
        WHERE id = ?
    `;

    const [result] = await db.query(query, [
        status,
        id
    ]);

    return result;
};


module.exports = {
    createFAQ,
    getAllFAQs,
    getFAQById,
    updateFAQ,
    deleteFAQ,
    updateFAQStatus
};