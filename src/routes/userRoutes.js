const express = require("express");
const router = express.Router();
 
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
 
router.put("/wishlist", authMiddleware, userController.updateWishlist);
router.put("/address", authMiddleware, userController.addAddress);
router.put("/change-password", authMiddleware, userController.userChangePassword);
router.post("/forgot-password", userController.userForgotPassword);
router.post("/reset-password", userController.userResetPassword);
module.exports = router;