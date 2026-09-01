const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get(
  "/overview",
  authMiddleware,
  adminMiddleware,
  dashboardController.getDashboardOverview
);

module.exports = router;
