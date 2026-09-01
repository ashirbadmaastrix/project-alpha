const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminModel = require("../models/adminModel");
const userModel = require("../models/authModel");

// admin Section 
const adminSignIn = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingAdmin = await adminModel.findAdminByEmail(email);

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminId = await adminModel.createAdmin(
      name,
      email,
      hashedPassword
    );

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: adminId,
        name,
        email,
      },
    });
  } catch (error) {
    console.error("SignIn Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await adminModel.findAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (admin.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    /*
    const refreshToken = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await adminModel.updateRefreshToken(admin.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    */

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token: token,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const admin = await adminModel.findAdminByRefreshToken(token);
      if (admin) {
        await adminModel.updateRefreshToken(admin.id, null);
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const adminChangePassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;
 
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }
 
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }
 
    const admin = await adminModel.findAdminPassword(adminId);
 
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
 
    if (admin.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
    }
 
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );
 
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }
 
    const hashedPassword = await bcrypt.hash(newPassword, 10);
 
    await adminModel.updatePassword(adminId, hashedPassword);
 
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
 
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

//User Auth Section 
const UserRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(name, email, hashedPassword);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { id: userId, name, email },
    });
  } catch (error) {
    console.error("User registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const Userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);

    if (!user || user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "User login successful",
      token,
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });
  } catch (error) {
    console.error("User login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// const userStatusChange = async (req, res) => {
    
// }

module.exports = {
  adminSignIn,
  adminLogin,
  adminChangePassword,
  // refreshToken,
   logout,
   UserRegister,
   Userlogin
};