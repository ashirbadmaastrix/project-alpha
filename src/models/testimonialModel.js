const {pool: db} = require("../config/db");

const createTestimonial = async (data) => {
    const { name, img, designation, testimonials } = data;

    const [result] = await db.query(
        `INSERT INTO pa_testimonials 
        (name, img, designation, testimonials)
        VALUES (?, ?, ?, ?)`,
        [name, img, designation, testimonials]
    );

    return result.insertId;
};

const getAllTestimonials = async () => {
    const [rows] = await db.query(
        `SELECT * FROM pa_testimonials
         ORDER BY created_at DESC`
    );

    return rows;
};

const getTestimonialById = async (id) => {
    const [rows] = await db.query(
        `SELECT * FROM pa_testimonials
         WHERE id = ?`,
        [id]
    );

    return rows[0];
};

const updateTestimonial = async (id, data) => {
    const { name, img, designation, testimonials } = data;

    const [result] = await db.query(
        `UPDATE pa_testimonials
         SET name = ?,
             img = ?,
             designation = ?,
             testimonials = ?
         WHERE id = ?`,
        [name, img, designation, testimonials, id]
    );

    return result;
};

const deleteTestimonial = async (id) => {
    const [result] = await db.query(
        `DELETE FROM pa_testimonials
         WHERE id = ?`,
        [id]
    );

    return result;
};

module.exports = {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
};