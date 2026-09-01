const {pool: db} = require("../config/db");

// Create banner
const createBanner = async (bannerData) => {
    const {
        title,
        img,
        link,
        sort_order,
        status,
        position
    } = bannerData;

    const query = `
        INSERT INTO pa_banners
        (title, img, link, sort_order, status, position)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
        title,
        img,
        link || null,
        sort_order || 0,
        status ?? 1,
        position || null
    ]);

    return result;
};

// Get all banners
const getAllBanners = async () => {
    const query = `
        SELECT *
        FROM pa_banners
        ORDER BY sort_order ASC, id DESC
    `;

    const [rows] = await db.execute(query);

    return rows;
};

// Get banner by ID
const getBannerById = async (id) => {
    const query = `
        SELECT *
        FROM pa_banners
        WHERE id = ?
    `;

    const [rows] = await db.execute(query, [id]);

    return rows[0];
};

// Update banner
const updateBanner = async (id, bannerData) => {
    const {
        title,
        img,
        link,
        sort_order,
        status,
        position
    } = bannerData;

    const query = `
        UPDATE pa_banners
        SET
            title = ?,
            img = ?,
            link = ?,
            sort_order = ?,
            status = ?,
            position = ?
        WHERE id = ?
    `;

    const [result] = await db.execute(query, [
        title,
        img,
        link || null,
        sort_order ?? 0,
        status ?? 1,
        position || null,
        id
    ]);

    return result;
};

// Delete banner
const deleteBanner = async (id) => {
    const query = `
        DELETE FROM pa_banners
        WHERE id = ?
    `;

    const [result] = await db.execute(query, [id]);

    return result;
};

module.exports = {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner
};