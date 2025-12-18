const Room = require('../models/roomModel');

// Get all rooms with filtering
exports.getAllRooms = async (req, res) => {
    try {
        const { type, building, floor, minCapacity, isAvailable, isActive } = req.query;

        const filter = {};
        if (type) filter.type = type;
        if (building) filter.building = building;
        if (floor !== undefined) filter.floor = parseInt(floor);
        if (minCapacity) filter.capacity = { $gte: parseInt(minCapacity) };
        if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const rooms = await Room.find(filter)
            .sort({ building: 1, floor: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: { rooms }
        });
    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve rooms'
        });
    }
};

// Get single room by ID
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { room }
        });
    } catch (error) {
        console.error('Get room error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve room'
        });
    }
};

// Create new room
exports.createRoom = async (req, res) => {
    try {
        const { name, type, capacity, building, floor, equipment, description } = req.body;

        const room = await Room.create({
            name,
            type,
            capacity,
            building,
            floor,
            equipment,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: { room }
        });
    } catch (error) {
        console.error('Create room error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Room name already exists'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create room'
        });
    }
};

// Update room
exports.updateRoom = async (req, res) => {
    try {
        const { name, type, capacity, building, floor, equipment, description, isAvailable, isActive } = req.body;

        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        if (name !== undefined) room.name = name;
        if (type !== undefined) room.type = type;
        if (capacity !== undefined) room.capacity = capacity;
        if (building !== undefined) room.building = building;
        if (floor !== undefined) room.floor = floor;
        if (equipment !== undefined) room.equipment = equipment;
        if (description !== undefined) room.description = description;
        if (isAvailable !== undefined) room.isAvailable = isAvailable;
        if (isActive !== undefined) room.isActive = isActive;

        await room.save();

        res.status(200).json({
            success: true,
            message: 'Room updated successfully',
            data: { room }
        });
    } catch (error) {
        console.error('Update room error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update room'
        });
    }
};

// Delete room
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Check if room is used in any timetable entries
        const TimetableEntry = require('../models/timetableEntryModel');
        const entriesCount = await TimetableEntry.countDocuments({ roomId: req.params.id });

        if (entriesCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete room. It is used in ${entriesCount} timetable entries. Consider deactivating instead.`
            });
        }

        await room.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Room deleted successfully'
        });
    } catch (error) {
        console.error('Delete room error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete room'
        });
    }
};

// Get rooms by building
exports.getRoomsByBuilding = async (req, res) => {
    try {
        const rooms = await Room.find({
            building: req.params.building,
            isActive: true
        })
            .sort({ floor: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: { rooms }
        });
    } catch (error) {
        console.error('Get building rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve building rooms'
        });
    }
};

// Get available rooms (for scheduling)
exports.getAvailableRooms = async (req, res) => {
    try {
        const { minCapacity, type, equipment } = req.query;

        const filter = {
            isActive: true,
            isAvailable: true
        };

        if (minCapacity) filter.capacity = { $gte: parseInt(minCapacity) };
        if (type) filter.type = type;
        if (equipment) filter.equipment = { $in: equipment.split(',') };

        const rooms = await Room.find(filter)
            .sort({ capacity: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: { rooms }
        });
    } catch (error) {
        console.error('Get available rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve available rooms'
        });
    }
};