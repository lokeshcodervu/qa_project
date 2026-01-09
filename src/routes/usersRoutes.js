const express = require("express");
const router = express.Router();
const { createBasicUser , verifyEmailOtp ,selectRole , loginUser, forgotPassword ,verifyResetOtp ,  resetPassword}= require("../controllers/userController");
const {authMiddleware} = require("../middlewares/authMiddleware");
// User Registration
router.post("/register", createBasicUser);
router.post("/verify-otp", verifyEmailOtp);
router.post("/select-role", authMiddleware, selectRole);
router.post("/login", loginUser);

router.post("/forgot-password",forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

module.exports = router;