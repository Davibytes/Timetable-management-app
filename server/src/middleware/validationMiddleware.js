const Joi = require('joi');

// Validate registration
exports.validateRegister = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required().messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name cannot exceed 50 characters'
        }),
        lastName: Joi.string().min(2).max(50).required().messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name cannot exceed 50 characters'
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email'
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters'
        }),
        role: Joi.string().valid('admin', 'lecturer', 'student').default('student'),
        department: Joi.string().allow('').optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

// Validate login
exports.validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email'
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

// Validate forgot password
exports.validateForgotPassword = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

// Validate reset password
exports.validateResetPassword = (req, res, next) => {
    const schema = Joi.object({
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters'
        })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};