const mongoose = require('mongoose');

const timetableEntrySchema = new mongoose.Schema({
    timetableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timetable',
        required: [true, 'Timetable reference is required']
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required']
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, 'Room reference is required']
    },
    lecturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Lecturer reference is required']
    },
    dayOfWeek: {
        type: String,
        required: [true, 'Day of week is required'],
        enum: {
            values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            message: '{VALUE} is not a valid day of week'
        }
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in format HH:MM (e.g., 08:00)']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in format HH:MM (e.g., 10:00)']
    },
    type: {
        type: String,
        required: true,
        enum: {
            values: ['Lecture', 'Tutorial', 'Lab', 'Seminar', 'Workshop'],
            message: '{VALUE} is not a valid session type'
        },
        default: 'Lecture'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [300, 'Notes cannot exceed 300 characters']
    },
    isRecurring: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

timetableEntrySchema.index({ timetableId: 1, dayOfWeek: 1, startTime: 1 });
timetableEntrySchema.index({ lecturerId: 1, dayOfWeek: 1, startTime: 1 });
timetableEntrySchema.index({ roomId: 1, dayOfWeek: 1, startTime: 1 });
timetableEntrySchema.index({ courseId: 1 });
timetableEntrySchema.index({ timetableId: 1 });

// Duration calculation
timetableEntrySchema.virtual('duration').get(function () {
    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes - startMinutes;
});

// Check time overlap with another entry
timetableEntrySchema.methods.overlaps = function (otherEntry) {
    if (this.dayOfWeek !== otherEntry.dayOfWeek) {
        return false;
    }

    const [thisStartHour, thisStartMin] = this.startTime.split(':').map(Number);
    const [thisEndHour, thisEndMin] = this.endTime.split(':').map(Number);
    const [otherStartHour, otherStartMin] = otherEntry.startTime.split(':').map(Number);
    const [otherEndHour, otherEndMin] = otherEntry.endTime.split(':').map(Number);

    const thisStart = thisStartHour * 60 + thisStartMin;
    const thisEnd = thisEndHour * 60 + thisEndMin;
    const otherStart = otherStartHour * 60 + otherStartMin;
    const otherEnd = otherEndHour * 60 + otherEndMin;

    return thisStart < otherEnd && otherStart < thisEnd;
};

timetableEntrySchema.methods.getTimeRange = function () {
    return `${this.startTime} - ${this.endTime}`;
};

// Check for conflicts
timetableEntrySchema.statics.findConflicts = async function (entryData) {
    const conflicts = {
        lecturer: [],
        room: [],
        timetable: []
    };

    // Check lecturer conflicts
    const lecturerConflicts = await this.find({
        lecturerId: entryData.lecturerId,
        dayOfWeek: entryData.dayOfWeek,
        _id: { $ne: entryData._id } // Exclude current entry if updating
    });

    // Check room conflicts
    const roomConflicts = await this.find({
        roomId: entryData.roomId,
        dayOfWeek: entryData.dayOfWeek,
        _id: { $ne: entryData._id }
    });

    // Check timetable conflicts
    const timetableConflicts = await this.find({
        timetableId: entryData.timetableId,
        courseId: entryData.courseId,
        dayOfWeek: entryData.dayOfWeek,
        _id: { $ne: entryData._id }
    });

    // Filter by actual time overlap
    const tempEntry = {
        dayOfWeek: entryData.dayOfWeek,
        startTime: entryData.startTime,
        endTime: entryData.endTime
    };

    lecturerConflicts.forEach(entry => {
        if (this.prototype.overlaps.call(tempEntry, entry)) {
            conflicts.lecturer.push(entry);
        }
    });

    roomConflicts.forEach(entry => {
        if (this.prototype.overlaps.call(tempEntry, entry)) {
            conflicts.room.push(entry);
        }
    });

    timetableConflicts.forEach(entry => {
        if (this.prototype.overlaps.call(tempEntry, entry)) {
            conflicts.timetable.push(entry);
        }
    });

    return conflicts;
};

// Pre-save validation: ensure end time is after start time
timetableEntrySchema.pre('save', function (next) {
    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
        return next(new Error('End time must be after start time'));
    }

    const duration = endMinutes - startMinutes;
    if (duration < 30) {
        return next(new Error('Session duration must be at least 30 minutes'));
    }

    if (duration > 240) {
        return next(new Error('Session duration cannot exceed 240 minutes'));
    }

    next();
});

// Pre-save middleware to validate lecturer role
timetableEntrySchema.pre('save', async function (next) {
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

timetableEntrySchema.methods.toJSON = function () {
    const obj = this.toObject();
    return obj;
};

const TimetableEntry = mongoose.model('TimetableEntry', timetableEntrySchema);

module.exports = TimetableEntry;