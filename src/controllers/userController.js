const userModel = require("../models/userModel");
const { sendPasswordResetEmail, } = require("../config/mail");
const bcrypt = require("bcrypt")

const updateWishlist = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { product_id } = req.body;
 
        // Validate product ID
        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }
 
        // Convert product ID to number
        const productId = Number(product_id);
 
        if (!Number.isInteger(productId) || productId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }
 
        // Get user wishlist
        const user = await userModel.getWishlist(userId);
 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
 
        // Parse existing wishlist
        let wishlist = [];
 
        if (user.wishlist) {
            try {
                wishlist =
                    typeof user.wishlist === "string"
                        ? JSON.parse(user.wishlist)
                        : user.wishlist;
            } catch (error) {
                wishlist = [];
            }
        }
 
        // Make sure wishlist is an array
        if (!Array.isArray(wishlist)) {
            wishlist = [];
        }
 
        // Check whether product already exists
        const productIndex = wishlist.indexOf(productId);
 
        if (productIndex !== -1) {
            // Product already exists → remove it
            wishlist.splice(productIndex, 1);
 
            await userModel.updateWishlist(userId, wishlist);
 
            return res.status(200).json({
                success: true,
                message: "Product removed from wishlist",
                wishlist,
            });
        }
 
        // Product doesn't exist → add it
        wishlist.push(productId);
 
        await userModel.updateWishlist(userId, wishlist);
 
        return res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist,
        });
    } catch (error) {
        console.error("Wishlist Error:", error);
 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const userChangePassword = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { currentPassword, newPassword } = req.body;
 
        // Validate passwords
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }
 
        // Check if new password is same as current password
        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password",
            });
        }
 
        // Get user
        const user = await userModel.findUserById(userId);
 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
 
        // Check user status
        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "User account is inactive",
            });
        }
 
        // Compare current password with stored password
        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );
 
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }
 
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
 
        // Update password
        await userModel.updatePassword(
            userId,
            hashedPassword
        );
 
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("User Change Password Error:", error);
 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const userForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
 
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
 
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If the email exists, a password reset code has been sent",
            });
        }
 
        if (user.status !== "active") {
            return res.status(200).json({
                success: true,
                message:
                    "If the email exists, a password reset code has been sent",
            });
        }
 
        // Generate 6-digit reset code
        const resetCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
 
        // Code expires after 10 minutes
        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );
 
        await userModel.savePasswordResetCode(
            user.user_id,
            resetCode,
            expiresAt
        );
 
        // Send email
        await sendPasswordResetEmail(
            user.email,
            resetCode
        );
 
        return res.status(200).json({
            success: true,
            message: "Password reset code sent successfully",
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
 
const userResetPassword = async (req, res) => {
    try {
        const {
            email,
            password_reset_code,
            newPassword,
        } = req.body;
 
        if (!email || !password_reset_code || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, reset code and new password are required",
            });
        }
 
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters",
            });
        }
 
        const user = await userModel.findUserByEmail(email);
 
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or reset code",
            });
        }
 
        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "User account is inactive",
            });
        }
 
        // Check reset code
        if (!user.password_reset_code || user.password_reset_code !== password_reset_code) {
            return res.status(400).json({
                success: false,
                message: "Invalid reset code",
            });
        }
 
        // Check reset code expiry
        if (!user.password_reset_expires_at || new Date() > new Date(user.password_reset_expires_at)) {
            return res.status(400).json({
                success: false,
                message: "Reset code has expired",
            });
        }
 
        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );
 
        // Update password and clear reset data
        await userModel.resetPassword(
            user.user_id,
            hashedPassword
        );
 
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const addAddress = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { address } = req.body;
 
        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Address is required",
            });
        }
 
        const user = await userModel.findUserById(userId);
        let addresses = [];

        if (user && user.address) {
            try {
                // The address field is JSON stringified in the DB
                const parsed = JSON.parse(user.address);
                if (Array.isArray(parsed)) {
                    addresses = parsed;
                } else {
                    addresses = [parsed];
                }
            } catch (e) {
                // Fallback for raw strings if they managed to bypass somehow
                addresses = [user.address];
            }
        }
        
        // Append the new address
        addresses.push(address);

        await userModel.updateAddress(userId, addresses);
 
        return res.status(200).json({
            success: true,
            message: "Address added successfully",
            addresses,
        });
    } catch (error) {
        console.error("Add Address Error:", error);
 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    updateWishlist,
    userChangePassword,
    userResetPassword,
    userForgotPassword,
    addAddress
};