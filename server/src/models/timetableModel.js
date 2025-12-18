const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Timetable name is required'],
        trim: true,
        minlength: [3, 'Timetable name must be at least 3 characters'],
        maxlength: [100, 'Timetable name cannot exceed 100 characters']
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
    academicYear: {
        type: String,
        required: [true, 'Academic year is required'],
        trim: true,
        match: [/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY (e.g., 2024-2025)']
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['Draft', 'Published', 'Archived'],
            message: '{VALUE} is not a valid status'
        },
        default: 'Draft'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required']
    },
    publishedAt: {
        type: Date
    },
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    version: {
        type: Number,
        default: 1,
        min: [1, 'Version must be at least 1']
    },
    metadata: {
        totalCourses: {
            type: Number,
            default: 0,
            min: [0, 'Total courses cannot be negative']
        },
        totalSessions: {
            type: Number,
            default: 0,
            min: [0, 'Total sessions cannot be negative']
        },
        conflictCount: {
            type: Number,
            default: 0,
            min: [0, 'Conflict count cannot be negative']
        }
    }
}, {
    timestamps: true
});

timetableSchema.index({ department: 1, semester: 1, academicYear: 1, status: 1 });
timetableSchema.index({ createdBy: 1 });
timetableSchema.index({ status: 1 });
timetableSchema.index({ academicYear: 1 });

timetableSchema.virtual('isPublished').get(function () {
    return this.status === 'Published';
});

timetableSchema.virtual('isDraft').get(function () {
    return this.status === 'Draft';
});

timetableSchema.virtual('isArchived').get(function () {
    return this.status === 'Archived';
});

// Publish timetable
timetableSchema.methods.publish = async function (userId) {
    if (this.status === 'Published') {
        throw new Error('Timetable is already published');
    }

    if (this.status === 'Archived') {
        throw new Error('Cannot publish archived timetable');
    }

    this.status = 'Published';
    this.publishedAt = new Date();
    this.publishedBy = userId;
    this.version += 1;

    return this.save();
};

// Undo publish timetable (back to draft)
timetableSchema.methods.unpublish = async function () {
    if (this.status !== 'Published') {
        throw new Error('Only published timetables can be unpublished');
    }

    this.status = 'Draft';
    return this.save();
};

// Archive timetable
timetableSchema.methods.archive = async function () {
    if (this.status === 'Archived') {
        throw new Error('Timetable is already archived');
    }

    this.status = 'Archived';
    return this.save();
};

// Update metadata based on timetable entries
timetableSchema.methods.updateMetadata = async function () {
    const TimetableEntry = mongoose.model('TimetableEntry');

    const sessions = await TimetableEntry.find({ timetableId: this._id });
    const uniqueCourses = new Set(sessions.map(s => s.courseId.toString()));

    this.metadata.totalCourses = uniqueCourses.size;
    this.metadata.totalSessions = sessions.length;

    return this.save();
};

timetableSchema.methods.canModify = function () {
    return this.status === 'Draft';
};

// Pre-save middleware to validate creator role
timetableSchema.pre('save', async function (next) {
    if (this.isModified('createdBy')) {
        const User = mongoose.model('User');
        const creator = await User.findById(this.createdBy);

        if (!creator) {
            return next(new Error('Creator not found'));
        }

        if (creator.role !== 'admin' && creator.role !== 'lecturer') {
            return next(new Error('Only admins and lecturers can create timetables'));
        }
    }
    next();
});

timetableSchema.methods.toJSON = function () {
    const obj = this.toObject();
    return obj;
};

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;