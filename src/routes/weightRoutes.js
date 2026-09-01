const express = require("express");

const {
  getWeights,
  getWeightById,
  createWeight,
  updateWeight,
  deleteWeight,
} = require("../controllers/weightController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// Get all weights
router.get("/", getWeights);

// Get weight by ID
router.get("/:id", getWeightById);

// Create weight
router.post("/create",authMiddleware,adminMiddleware, createWeight);

// Update weight
router.put("/:id",authMiddleware,adminMiddleware, updateWeight);

// Delete weight
router.delete("/:id",authMiddleware,adminMiddleware, deleteWeight);

module.exports = router;