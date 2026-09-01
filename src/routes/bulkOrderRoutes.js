const express = require("express");

const router = express.Router();

const bulkOrderController = require("../controllers/bulkOrderController");


// Get all bulk orders
router.get(
    "/",
    bulkOrderController.getAllBulkOrders
);


// Create new bulk order draft
router.post(
    "/",
    bulkOrderController.createBulkOrder
);


// Submit bulk order
router.patch(
    "/:session_id/submit",
    bulkOrderController.submitBulkOrder
);


// Cancel bulk order
router.patch(
    "/:session_id/cancel",
    bulkOrderController.cancelBulkOrder
);


// Get bulk order using session ID
router.get(
    "/:session_id",
    bulkOrderController.getBulkOrder
);


// Update bulk order / save step
router.patch(
    "/:session_id",
    bulkOrderController.updateBulkOrder
);


module.exports = router;