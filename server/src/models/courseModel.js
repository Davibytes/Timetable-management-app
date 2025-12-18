const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Course code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true,
        minlength: [3, 'Course name must be at least 3 characters'],
        maxlength: [100, 'Course name cannot exceed 100 characters']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    semester: {
        type: Number,
        required: [true, 'Semester is required'],
        min: [1, 'Semester must be at least 1'],
        max: [4, 'Semester cannot exceed 4']
    },
    credits: {
        type: Number,
        required: [true, 'Credits are required'],
        min: [1, 'Credits must be at least 1'],
        max: [10, 'Credits cannot exceed 10']
    },
    lecturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Lecturer is required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [30, 'Duration must be at least 30 minutes'],
        max: [240, 'Duration cannot exceed 240 minutes'],
        default: 120
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

courseSchema.index({ department: 1, semester: 1 });
courseSchema.index({ code: 1 });
courseSchema.index({ lecturerId: 1 });

courseSchema.virtual('fullCode').get(function () {
    return `${this.code} - ${this.name}`;
});

// Generate course code
courseSchema.statics.generateCode = async function (department, semester) {
    const deptPrefix = department.substring(0, 3).toUpperCase().replace(/\s/g, '');

    const existingCourses = await this.find({
        code: new RegExp(`^${deptPrefix}`)
    }).sort({ code: -1 }).limit(1);

    let courseNumber = 100 + (semester * 100); // 100-level for sem 1, 200 for sem 2, etc.

    if (existingCourses.length > 0) {
        const lastCode = existingCourses[0].code;
        const lastNumber = parseInt(lastCode.substring(3));
        const baseNumber = 100 + (semester * 100);

        if (lastNumber >= baseNumber && lastNumber < baseNumber + 100) {
            courseNumber = lastNumber + 1;
        }
    }

    return `${deptPrefix}${courseNumber}`;
};

// Pre-save middleware to auto-generate code if not provided
courseSchema.pre('save', async function (next) {
    // Generate code if it's a new course and code is not manually set
    if (this.isNew && !this.code) {
        try {
            this.code = await this.constructor.generateCode(this.department, this.semester);
        } catch (error) {
            return next(new Error('Failed to generate course code'));
        }
    }

    // Validate lecturer role
    if (this.isModified('lecturerId')) {
        const User = mongoose.model('User');
        const lecturer = await User.findById(this.lecturerId);

        if (!lecturer) {
            return next(new Error('Lecturer not found'));
        }

        if (lecturer.role !== 'lecturer' && lecturer.role !== 'admin') {
            return next(new Error('Assigned user must be a lecturer or admin'));
        }
    }

    next();
});

courseSchema.methods.toJSON = function () {
    const obj = this.toObject();
    return obj;
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;