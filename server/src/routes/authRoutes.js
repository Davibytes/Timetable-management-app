const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getMe,
    updateProfile,
    changePassword,
    deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateUpdateProfile,
    validateChangePassword,
    validateDeleteAccount
} = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, validateUpdateProfile, updateProfile);
router.put('/change-password', protect, validateChangePassword, changePassword);
router.delete('/account', protect, validateDeleteAccount, deleteAccount);

module.exports = router;