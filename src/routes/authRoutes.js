const express = require("express");

const router = express.Router();

const {
  adminSignIn,
  adminLogin,
  // refreshToken,
  // logout
   UserRegister,
   Userlogin,
   adminChangePassword
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/admin-signin", adminSignIn);
router.post("/admin-login", adminLogin);
router.post("/adminChangePassword", authMiddleware, adminChangePassword)
// router.post("/refresh-token", refreshToken);
// router.post("/logout", logout);
router.post("/user-signin",UserRegister);
router.post("/user-login",Userlogin);

module.exports = router;