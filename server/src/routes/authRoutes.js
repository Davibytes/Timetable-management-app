const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword
} = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;