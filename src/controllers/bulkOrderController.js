const bulkOrderModel = require("../models/bulkOrderModel");
const crypto = require("crypto");

const normalizeItems = (body) => {
    if (body.items !== undefined) {
        if (!Array.isArray(body.items)) {
            const error = new Error("items must be an array");
            error.statusCode = 400;
            throw error;
        }

        return body.items;
    }

    if (body.product_id === undefined) {
        return [];
    }

    return [{
        product_id: body.product_id,
        category_id: body.category_id ?? null,
        quantity: body.quantity ?? null,
        weight_id: body.weight_id ?? null
    }];
};

const validateItems = (items) => {
    if (items.some((item) => !item || item.product_id === undefined || item.product_id === null)) {
        const error = new Error("Every item must include product_id");
        error.statusCode = 400;
        throw error;
    }
};

// Create bulk order draft
const createBulkOrder = async (req, res) => {
    try {

        const session_id = crypto.randomUUID();
        const items = normalizeItems(req.body);
        validateItems(items);

        const data = {
            ...req.body,
            items,
            session_id,
            current_step: req.body.current_step || 1,
            status: "draft"
        };

        const id = await bulkOrderModel.createBulkOrder(data);

        const bulkOrder = await bulkOrderModel.getBulkOrderById(id);

        return res.status(201).json({
            success: true,
            message: "Bulk order draft created successfully",
            data: bulkOrder
        });

    } catch (error) {

        console.error("Create Bulk Order Error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: "Failed to create bulk order",
            error: error.message
        });
    }
};


// Get bulk order by session ID
const getBulkOrder = async (req, res) => {
    try {

        const { session_id } = req.params;

        const bulkOrder =
            await bulkOrderModel.getBulkOrderBySessionId(session_id);

        if (!bulkOrder) {
            return res.status(404).json({
                success: false,
                message: "Bulk order not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: bulkOrder
        });

    } catch (error) {

        console.error("Get Bulk Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get bulk order",
            error: error.message
        });
    }
};


// Update bulk order
const updateBulkOrder = async (req, res) => {
    try {

        const { session_id } = req.params;

        const existingOrder =
            await bulkOrderModel.getBulkOrderBySessionId(session_id);

        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Bulk order not found"
            });
        }

        if (existingOrder.status !== "draft") {
            return res.status(400).json({
                success: false,
                message: "This bulk order can no longer be updated"
            });
        }

        const items = req.body.items === undefined && req.body.product_id === undefined
            ? undefined
            : normalizeItems(req.body);

        if (items !== undefined) {
            validateItems(items);
        }

        const updated =
            await bulkOrderModel.updateBulkOrder(
                session_id,
                { ...req.body, ...(items === undefined ? {} : { items }) }
            );

        if (!updated) {
            return res.status(400).json({
                success: false,
                message: "No data was updated"
            });
        }

        const bulkOrder =
            await bulkOrderModel.getBulkOrderBySessionId(session_id);

        return res.status(200).json({
            success: true,
            message: "Bulk order saved successfully",
            data: bulkOrder
        });

    } catch (error) {

        console.error("Update Bulk Order Error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: "Failed to update bulk order",
            error: error.message
        });
    }
};


// Submit bulk order
const submitBulkOrder = async (req, res) => {
    try {

        const { session_id } = req.params;

        const existingOrder =
            await bulkOrderModel.getBulkOrderBySessionId(session_id);

        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Bulk order not found"
            });
        }

        if (existingOrder.status === "submitted") {
            return res.status(400).json({
                success: false,
                message: "Bulk order already submitted"
            });
        }

        const submitted =
            await bulkOrderModel.submitBulkOrder(session_id);

        if (!submitted) {
            return res.status(400).json({
                success: false,
                message: "Unable to submit bulk order"
            });
        }

        const bulkOrder =
            await bulkOrderModel.getBulkOrderBySessionId(session_id);

        return res.status(200).json({
            success: true,
            message: "Bulk order submitted successfully",
            data: bulkOrder
        });

    } catch (error) {

        console.error("Submit Bulk Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit bulk order",
            error: error.message
        });
    }
};


// Cancel bulk order
const cancelBulkOrder = async (req, res) => {
    try {

        const { session_id } = req.params;

        const existingOrder =
            await bulkOrderModel.getBulkOrderBySessionId(session_id);

        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Bulk order not found"
            });
        }

        const cancelled =
            await bulkOrderModel.cancelBulkOrder(session_id);

        if (!cancelled) {
            return res.status(400).json({
                success: false,
                message: "Unable to cancel bulk order"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Bulk order cancelled successfully"
        });

    } catch (error) {

        console.error("Cancel Bulk Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to cancel bulk order",
            error: error.message
        });
    }
};


// Get all bulk orders
const getAllBulkOrders = async (req, res) => {
    try {

        const bulkOrders =
            await bulkOrderModel.getAllBulkOrders();

        return res.status(200).json({
            success: true,
            count: bulkOrders.length,
            data: bulkOrders
        });

    } catch (error) {

        console.error("Get All Bulk Orders Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get bulk orders",
            error: error.message
        });
    }
};


module.exports = {
    createBulkOrder,
    getBulkOrder,
    updateBulkOrder,
    submitBulkOrder,
    cancelBulkOrder,
    getAllBulkOrders
};