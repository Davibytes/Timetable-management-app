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

// Validate course creation
exports.validateCreateCourse = (req, res, next) => {
    const schema = Joi.object({
        code: Joi.string().uppercase().trim().optional(),
        name: Joi.string().min(3).max(100).required().messages({
            'string.empty': 'Course name is required',
            'string.min': 'Course name must be at least 3 characters',
            'string.max': 'Course name cannot exceed 100 characters'
        }),
        department: Joi.string().required().messages({
            'string.empty': 'Department is required'
        }),
        semester: Joi.number().integer().min(1).max(4).required().messages({
            'number.base': 'Semester must be a number',
            'number.min': 'Semester must be at least 1',
            'number.max': 'Semester cannot exceed 4',
            'any.required': 'Semester is required'
        }),
        credits: Joi.number().integer().min(1).max(10).required().messages({
            'number.base': 'Credits must be a number',
            'number.min': 'Credits must be at least 1',
            'number.max': 'Credits cannot exceed 10',
            'any.required': 'Credits are required'
        }),
        lecturerId: Joi.string().length(24).hex().required().messages({
            'string.empty': 'Lecturer is required',
            'string.length': 'Invalid lecturer ID format',
            'string.hex': 'Invalid lecturer ID format'
        }),
        duration: Joi.number().integer().min(30).max(240).default(120).messages({
            'number.min': 'Duration must be at least 30 minutes',
            'number.max': 'Duration cannot exceed 240 minutes'
        }),
        description: Joi.string().max(500).allow('').optional()
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

// Validate course update
exports.validateUpdateCourse = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).optional(),
        department: Joi.string().optional(),
        semester: Joi.number().integer().min(1).max(4).optional(),
        credits: Joi.number().integer().min(1).max(10).optional(),
        lecturerId: Joi.string().length(24).hex().optional(),
        duration: Joi.number().integer().min(30).max(240).optional(),
        description: Joi.string().max(500).allow('').optional(),
        isActive: Joi.boolean().optional()
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

// Validate room creation
exports.validateCreateRoom = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().uppercase().required().messages({
            'string.empty': 'Room name is required'
        }),
        type: Joi.string().valid('Lecture Hall', 'Laboratory', 'Amphitheater', 'Tutorial Room', 'Seminar Room', 'Other').required().messages({
            'string.empty': 'Room type is required',
            'any.only': 'Invalid room type'
        }),
        capacity: Joi.number().integer().min(10).max(500).required().messages({
            'number.base': 'Capacity must be a number',
            'number.min': 'Capacity must be at least 10',
            'number.max': 'Capacity cannot exceed 500',
            'any.required': 'Capacity is required'
        }),
        building: Joi.string().required().messages({
            'string.empty': 'Building is required'
        }),
        floor: Joi.number().integer().min(0).max(20).required().messages({
            'number.base': 'Floor must be a number',
            'number.min': 'Floor cannot be negative',
            'number.max': 'Floor cannot exceed 20',
            'any.required': 'Floor is required'
        }),
        equipment: Joi.array().items(
            Joi.string().valid('Projector', 'Whiteboard', 'Computer', 'Audio System', 'Video Conferencing', 'Lab Equipment', 'Air Conditioning', 'Microphone')
        ).optional(),
        description: Joi.string().max(300).allow('').optional()
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

// Validate room update
exports.validateUpdateRoom = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().uppercase().optional(),
        type: Joi.string().valid('Lecture Hall', 'Laboratory', 'Amphitheater', 'Tutorial Room', 'Seminar Room', 'Other').optional(),
        capacity: Joi.number().integer().min(10).max(500).optional(),
        building: Joi.string().optional(),
        floor: Joi.number().integer().min(0).max(20).optional(),
        equipment: Joi.array().items(
            Joi.string().valid('Projector', 'Whiteboard', 'Computer', 'Audio System', 'Video Conferencing', 'Lab Equipment', 'Air Conditioning', 'Microphone')
        ).optional(),
        description: Joi.string().max(300).allow('').optional(),
        isAvailable: Joi.boolean().optional(),
        isActive: Joi.boolean().optional()
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

// Validate timetable creation
exports.validateCreateTimetable = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required().messages({
            'string.empty': 'Timetable name is required',
            'string.min': 'Timetable name must be at least 3 characters',
            'string.max': 'Timetable name cannot exceed 100 characters'
        }),
        department: Joi.string().required().messages({
            'string.empty': 'Department is required'
        }),
        semester: Joi.number().integer().min(1).max(4).required().messages({
            'number.base': 'Semester must be a number',
            'number.min': 'Semester must be at least 1',
            'number.max': 'Semester cannot exceed 4',
            'any.required': 'Semester is required'
        }),
        academicYear: Joi.string().pattern(/^\d{4}-\d{4}$/).required().messages({
            'string.empty': 'Academic year is required',
            'string.pattern.base': 'Academic year must be in format YYYY-YYYY (e.g., 2024-2025)'
        }),
        description: Joi.string().max(500).allow('').optional()
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

// Validate timetable update
exports.validateUpdateTimetable = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).optional(),
        department: Joi.string().optional(),
        semester: Joi.number().integer().min(1).max(4).optional(),
        academicYear: Joi.string().pattern(/^\d{4}-\d{4}$/).optional(),
        description: Joi.string().max(500).allow('').optional()
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

// Validate update profile
exports.validateUpdateProfile = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).optional().messages({
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name cannot exceed 50 characters'
        }),
        lastName: Joi.string().min(2).max(50).optional().messages({
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name cannot exceed 50 characters'
        }),
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

// Validate change password
exports.validateChangePassword = (req, res, next) => {
    const schema = Joi.object({
        currentPassword: Joi.string().required().messages({
            'string.empty': 'Current password is required'
        }),
        newPassword: Joi.string().min(6).required().messages({
            'string.empty': 'New password is required',
            'string.min': 'New password must be at least 6 characters'
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

// Validate delete account
exports.validateDeleteAccount = (req, res, next) => {
    const schema = Joi.object({
        password: Joi.string().required().messages({
            'string.empty': 'Password is required to delete account'
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

// Validate timetable entry creation
exports.validateCreateEntry = (req, res, next) => {
    const schema = Joi.object({
        timetableId: Joi.string().length(24).hex().required().messages({
            'string.empty': 'Timetable ID is required',
            'string.length': 'Invalid timetable ID format',
            'string.hex': 'Invalid timetable ID format'
        }),
        courseId: Joi.string().length(24).hex().required().messages({
            'string.empty': 'Course ID is required',
            'string.length': 'Invalid course ID format',
            'string.hex': 'Invalid course ID format'
        }),
        roomId: Joi.string().length(24).hex().required().messages({
            'string.empty': 'Room ID is required',
            'string.length': 'Invalid room ID format',
            'string.hex': 'Invalid room ID format'
        }),
        lecturerId: Joi.string().length(24).hex().required().messages({
            'string.empty': 'Lecturer ID is required',
            'string.length': 'Invalid lecturer ID format',
            'string.hex': 'Invalid lecturer ID format'
        }),
        dayOfWeek: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday').required().messages({
            'string.empty': 'Day of week is required',
            'any.only': 'Invalid day of week'
        }),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
            'string.empty': 'Start time is required',
            'string.pattern.base': 'Start time must be in format HH:MM (e.g., 08:00)'
        }),
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
            'string.empty': 'End time is required',
            'string.pattern.base': 'End time must be in format HH:MM (e.g., 10:00)'
        }),
        type: Joi.string().valid('Lecture', 'Tutorial', 'Lab', 'Seminar', 'Workshop').default('Lecture'),
        notes: Joi.string().max(300).allow('').optional()
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

// Validate timetable entry update
exports.validateUpdateEntry = (req, res, next) => {
    const schema = Joi.object({
        timetableId: Joi.string().length(24).hex().optional(),
        courseId: Joi.string().length(24).hex().optional(),
        roomId: Joi.string().length(24).hex().optional(),
        lecturerId: Joi.string().length(24).hex().optional(),
        dayOfWeek: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday').optional(),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
        type: Joi.string().valid('Lecture', 'Tutorial', 'Lab', 'Seminar', 'Workshop').optional(),
        notes: Joi.string().max(300).allow('').optional()
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