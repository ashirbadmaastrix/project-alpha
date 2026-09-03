const express = require("express");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getRootCategories,
  getCategoriesByParent,
} = require("../controllers/categoryController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// GET /api/categories
router.get("/", getCategories);

// GET /api/categories/root
router.get("/root", getRootCategories);

// GET /api/categories/parent/:parentCategory
router.get("/parent/:parentCategory", getCategoriesByParent);

// GET /api/categories/:id
router.get("/:id", getCategoryById);

// POST /api/categories
router.post("/create",authMiddleware, adminMiddleware,  upload.single("image"), createCategory);

// PUT /api/categories/:id
router.put("/:id",authMiddleware,adminMiddleware,  upload.single("image"),  updateCategory);

// DELETE /api/categories/:id
router.delete("/:id", authMiddleware , adminMiddleware , deleteCategory);

//create sub category 
router.post("/subcategory",authMiddleware, adminMiddleware, upload.single("image"), createSubCategory);

module.exports = router;