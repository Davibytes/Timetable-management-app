const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Room name is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    type: {
        type: String,
        required: [true, 'Room type is required'],
        enum: {
            values: ['Lecture Hall', 'Laboratory', 'Amphitheater', 'Tutorial Room', 'Seminar Room', 'Other'],
            message: '{VALUE} is not a valid room type'
        }
    },
    capacity: {
        type: Number,
        required: [true, 'Room capacity is required'],
        min: [10, 'Capacity must be at least 10'],
        max: [500, 'Capacity cannot exceed 500']
    },
    building: {
        type: String,
        required: [true, 'Building name is required'],
        trim: true
    },
    floor: {
        type: Number,
        required: [true, 'Floor is required'],
        min: [0, 'Floor cannot be negative'],
        max: [20, 'Floor cannot exceed 20']
    },
    equipment: [{
        type: String,
        trim: true,
        enum: {
            values: [
                'Projector',
                'Whiteboard',
                'Computer',
                'Audio System',
                'Video Conferencing',
                'Lab Equipment',
                'Air Conditioning',
                'Microphone'
            ],
            message: '{VALUE} is not a valid equipment type'
        }
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

roomSchema.index({ name: 1 });
roomSchema.index({ type: 1 });
roomSchema.index({ building: 1, floor: 1 });
roomSchema.index({ capacity: 1 });
roomSchema.index({ isAvailable: 1, isActive: 1 });

roomSchema.virtual('fullName').get(function () {
    return `${this.name} (${this.building}, Floor ${this.floor})`;
});

// Check if room can accommodate students
roomSchema.methods.canAccommodate = function (studentCount) {
    return this.isActive && this.isAvailable && this.capacity >= studentCount;
};

// Check if room has specific equipment
roomSchema.methods.hasEquipment = function (equipmentName) {
    return this.equipment.includes(equipmentName);
};

// Check if room is suitable for a course type
roomSchema.methods.isSuitableFor = function (courseType) {
    const typeMapping = {
        'Lab': ['Laboratory'],
        'Lecture': ['Lecture Hall', 'Amphitheater', 'Tutorial Room', 'Seminar Room'],
        'Tutorial': ['Tutorial Room', 'Seminar Room', 'Lecture Hall'],
        'Seminar': ['Seminar Room', 'Tutorial Room'],
        'Workshop': ['Laboratory', 'Tutorial Room']
    };

    return typeMapping[courseType]?.includes(this.type) || false;
};

roomSchema.methods.toJSON = function () {
    const obj = this.toObject();
    return obj;
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;