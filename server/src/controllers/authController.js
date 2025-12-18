const User = require('../models/userModel');
const crypto = require('crypto');

const tokenStore = new Map();

// Register new user
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, department } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: role || 'student',
            department,
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful. You can now login.',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if user exists and get password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        user.lastLogin = Date.now();
        await user.save();

        const token = user.generateToken();

        // Store session in memory
        tokenStore.set(user._id.toString(), {
            id: user._id,
            email: user.email,
            role: user.role,
            timestamp: Date.now()
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    department: user.department
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

// Logout user
exports.logout = async (req, res) => {
    try {
        // Remove session from memory
        tokenStore.delete(req.user._id.toString());

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this email'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        tokenStore.set(`reset:${hashedToken}`, {
            userId: user._id.toString(),
            expires: Date.now() + 3600000
        });

        // Send email with reset link
        try {
            const emailService = require('../services/emailService');
            await emailService.sendPasswordResetEmail(user.email, resetToken);
        } catch (emailError) {
            console.error('Email sending error:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Password reset instructions sent to your email',
            resetToken
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process password reset request'
        });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Check token in memory
        const tokenData = tokenStore.get(`reset:${hashedToken}`);
        if (!tokenData || tokenData.expires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Find user and update password
        const user = await User.findById(tokenData.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        tokenStore.delete(`reset:${hashedToken}`);

        res.status(200).json({
            success: true,
            message: 'Password reset successful. You can now login.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Password reset failed'
        });
    }
};

// Get current user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user data'
        });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, department } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update allowed fields
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (department !== undefined) user.department = department;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isPasswordCorrect = await user.comparePassword(currentPassword);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        // Send email notification
        try {
            const emailService = require('../services/emailService');
            await emailService.sendPasswordChangeNotification(user.email, user.firstName);
        } catch (emailError) {
            console.error('Email notification error:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password'
        });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password. Account deletion cancelled.'
            });
        }

        // Soft delete: deactivate account
        user.isActive = false;
        await user.save();

        // Handle user's based on role
        if (user.role === 'lecturer' || user.role === 'admin') {
            const Course = require('../models/courseModel');
            const Timetable = require('../models/timetableModel');

            await Course.updateMany(
                { lecturerId: user._id },
                { isActive: false }
            );

            await Timetable.updateMany(
                { createdBy: user._id, status: { $ne: 'Archived' } },
                { status: 'Archived' }
            );
        }

        tokenStore.delete(user._id.toString());

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully. All associated data has been handled.'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account'
        });
    }
};