const User = require('../models/userModel');
const crypto = require('crypto');

// Token storage - replace with Redis later
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

        // Create user
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

        // Validate input
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

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        // Verify password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate token
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

        // Store in memory
        tokenStore.set(`reset:${hashedToken}`, {
            userId: user._id.toString(),
            expires: Date.now() + 3600000
        });

        // Implement email later
        console.log('Reset token:', resetToken);

        res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            resetToken
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate reset token'
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

        // Delete reset token
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