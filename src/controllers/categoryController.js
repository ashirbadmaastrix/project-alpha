const Category = require("../models/categoryModel");

// Get categories without a parent category
const getRootCategories = async (req, res) => {
  try {
    const categories = await Category.getRootCategories();

    return res.status(200).json({
      success: true,
      message: "Root categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get root categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch root categories",
    });
  }
};

// Get categories by parent category
const getCategoriesByParent = async (req, res) => {
  try {
    const parentCategory = req.params.parentCategory;

    if (!parentCategory || !parentCategory.trim()) {
      return res.status(400).json({
        success: false,
        message: "Parent category name is required",
      });
    }

    const categories = await Category.getByParentCategory(parentCategory.trim());

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get categories by parent error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories by parent category",
    });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.getById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, parent_category, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const img_path = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const categoryId = await Category.create({
      name: name.trim(),
      parent_category:
        parent_category !== undefined && parent_category !== ""
          ? String(parent_category).trim()
          : null,
      img_path, 
      status: status !== undefined ? Number(status) : 1,
    });

    const category = await Category.getById(categoryId);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent_category, status } = req.body;

    const existingCategory = await Category.getById(id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // if (!name || !name.trim()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Category name is required",
    //   });
    // }

    const img_path = req.file
      ? `/uploads/${req.file.filename}`
      : existingCategory.img_path;

    await Category.update(id, {
      name:
        name !== undefined && name !== null
          ? name.trim()
          : existingCategory.name,
      parent_category:
        parent_category !== undefined
          ? parent_category === "" || parent_category === null
            ? null
            : String(parent_category).trim()
          : existingCategory.parent_category,
      img_path,
      status:
        status !== undefined
          ? Number(status)
          : existingCategory.status,
    });

    const updatedCategory = await Category.getById(id);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check category exists
    const existingCategory = await Category.getById(id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.delete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

// Create subcategory
const createSubCategory = async (req, res) => {
  try {
    const { name, parent_category, status } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subcategory name is required",
      });
    }

    // Validate parent category
    if (
      parent_category === undefined ||
      parent_category === null ||
      parent_category === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Parent category is required",
      });
    }

    const parentCategoryName = String(parent_category).trim();

    if (!parentCategoryName) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent category name",
      });
    }

    // Check parent category exists
    const parentCategory = await Category.getByName(parentCategoryName);

    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found",
      });
    }

    // Optional: prevent creating a subcategory under another subcategory
    if (parentCategory.parent_category !== null) {
      return res.status(400).json({
        success: false,
        message: "Subcategory cannot have another subcategory as parent",
      });
    }

    // Image
    const img_path = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    // Create subcategory
    const subCategoryId = await Category.createSubCategory({
      name: name.trim(),
      parent_category: parentCategoryName,
      img_path,
      status: status !== undefined ? Number(status) : 1,
    });

    // Get created subcategory
    const subCategory = await Category.getById(subCategoryId);

    return res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: subCategory,
    });

  } catch (error) {
    console.error("Create subcategory error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create subcategory",
    });
  }
};


module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getRootCategories,
  getCategoriesByParent,
};