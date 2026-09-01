const Weight = require("../models/weightModel");

// Get all weights
const getWeights = async (req, res) => {
  try {
    const weights = await Weight.getAll();

    return res.status(200).json({
      success: true,
      message: "Weights fetched successfully",
      data: weights,
    });
  } catch (error) {
    console.error("Get weights error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch weights",
    });
  }
};

// Get weight by ID
const getWeightById = async (req, res) => {
  try {
    const { id } = req.params;

    const weight = await Weight.getById(id);

    if (!weight) {
      return res.status(404).json({
        success: false,
        message: "Weight not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Weight fetched successfully",
      data: weight,
    });
  } catch (error) {
    console.error("Get weight error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch weight",
    });
  }
};

// Create weight
const createWeight = async (req, res) => {
  try {
    const { qty, status } = req.body;

    // Validate quantity
    if (qty === undefined || qty === null || qty === "") {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    // Validate status
    if (status !== undefined && ![0, 1].includes(Number(status))) {
      return res.status(400).json({
        success: false, 
        message: "Status must be either 0 or 1",
      });
    }

    const weightId = await Weight.create({
      qty: qty,
      status: status !== undefined ? Number(status) : 1,
    });

    const weight = await Weight.getById(weightId);

    return res.status(201).json({
      success: true,
      message: "Weight created successfully",
      data: weight,
    });
  } catch (error) {
    console.error("Create weight error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create weight",
    });
  }
};

// Update weight
const updateWeight = async (req, res) => {
  try {
    const { id } = req.params;
    const { qty, status } = req.body;

    const existingWeight = await Weight.getById(id);

    if (!existingWeight) {
      return res.status(404).json({
        success: false,
        message: "Weight not found",
      });
    }

    if (qty === undefined || qty === null || qty === "") {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    if (Number(qty) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    if (status !== undefined && ![0, 1].includes(Number(status))) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 0 or 1",
      });
    }

    await Weight.update(id, {
      qty: Number(qty),
      status:
        status !== undefined
          ? Number(status)
          : existingWeight.status,
    });

    const updatedWeight = await Weight.getById(id);

    return res.status(200).json({
      success: true,
      message: "Weight updated successfully",
      data: updatedWeight,
    });
  } catch (error) {
    console.error("Update weight error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update weight",
    });
  }
};

// Delete weight
const deleteWeight = async (req, res) => {
  try {
    const { id } = req.params;

    const existingWeight = await Weight.getById(id);

    if (!existingWeight) {
      return res.status(404).json({
        success: false,
        message: "Weight not found",
      });
    }

    await Weight.delete(id);

    return res.status(200).json({
      success: true,
      message: "Weight deleted successfully",
    });
  } catch (error) {
    console.error("Delete weight error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete weight",
    });
  }
};

module.exports = {
  getWeights,
  getWeightById,
  createWeight,
  updateWeight,
  deleteWeight,
};