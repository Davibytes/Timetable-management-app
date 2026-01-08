// --- VERSIONING ENDPOINTS (STUBS) ---
// Get all versions of a timetable
exports.getTimetableVersions = async (req, res) => {
    // TODO: Implement version history retrieval
    return res.status(501).json({
        success: false,
        message: 'Timetable versioning not implemented yet.'
    });
};

// Restore a timetable to a previous version
exports.restoreTimetableVersion = async (req, res) => {
    // TODO: Implement version restore
    return res.status(501).json({
        success: false,
        message: 'Timetable version restore not implemented yet.'
    });
};

// --- EXPORT ENDPOINTS (STUBS) ---
// Export timetable as PDF
exports.exportTimetablePDF = async (req, res) => {
    // TODO: Implement PDF export
    return res.status(501).json({
        success: false,
        message: 'Timetable PDF export not implemented yet.'
    });
};

// Export timetable as Excel
exports.exportTimetableExcel = async (req, res) => {
    // TODO: Implement Excel export
    return res.status(501).json({
        success: false,
        message: 'Timetable Excel export not implemented yet.'
    });
};
const Timetable = require('../models/timetableModel');
const TimetableEntry = require('../models/timetableEntryModel');

// Get all timetables with filtering
exports.getAllTimetables = async (req, res) => {
    try {
        const { department, semester, academicYear, status } = req.query;

        const filter = {};
        if (department) filter.department = department;
        if (semester) filter.semester = parseInt(semester);
        if (academicYear) filter.academicYear = academicYear;
        if (status) filter.status = status;

        // Students only see published timetables
        if (req.user.role === 'student') {
            filter.status = 'Published';
        }

        const timetables = await Timetable.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .populate('publishedBy', 'firstName lastName email')
            .sort({ academicYear: -1, semester: 1, department: 1 });

        res.status(200).json({
            success: true,
            count: timetables.length,
            data: { timetables }
        });
    } catch (error) {
        console.error('Get timetables error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve timetables'
        });
    }
};

// Get single timetable by ID
exports.getTimetableById = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email')
            .populate('publishedBy', 'firstName lastName email');

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: 'Timetable not found'
            });
        }

        if (req.user.role === 'student' && timetable.status !== 'Published') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. This timetable is not published yet.'
            });
        }

        res.status(200).json({
            success: true,
            data: { timetable }
        });
    } catch (error) {
        console.error('Get timetable error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve timetable'
        });
    }
};

// Create new timetable
exports.createTimetable = async (req, res) => {
    try {
        const { name, department, semester, academicYear, description } = req.body;

        const timetable = await Timetable.create({
            name,
            department,
            semester,
            academicYear,
            description,
            createdBy: req.user._id
        });

        await timetable.populate('createdBy', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Timetable created successfully',
            data: { timetable }
        });
    } catch (error) {
        console.error('Create timetable error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create timetable'
        });
    }
};

// Update timetable
exports.updateTimetable = async (req, res) => {
    try {
        const { name, department, semester, academicYear, description } = req.body;

        const timetable = await Timetable.findById(req.params.id);

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: 'Timetable not found'
            });
        }

        // Only draft timetables can be modified
        if (!timetable.canModify()) {
            return res.status(400).json({
                success: false,
                message: 'Only draft timetables can be modified. Unpublish first to make changes.'
            });
        }

        // Update fields
        if (name !== undefined) timetable.name = name;
        if (department !== undefined) timetable.department = department;
        if (semester !== undefined) timetable.semester = semester;
        if (academicYear !== undefined) timetable.academicYear = academicYear;
        if (description !== undefined) timetable.description = description;

        await timetable.save();

        await timetable.populate('createdBy', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Timetable updated successfully',
            data: { timetable }
        });
    } catch (error) {
        console.error('Update timetable error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update timetable'
        });
    }
};

// Delete timetable
exports.deleteTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: 'Timetable not found'
            });
        }

        // Cannot delete published timetables
        if (timetable.status === 'Published') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete published timetable. Unpublish or archive it first.'
            });
        }

        // Delete all associated entries
        await TimetableEntry.deleteMany({ timetableId: req.params.id });

        await timetable.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Timetable and all associated entries deleted successfully'
        });
    } catch (error) {
        console.error('Delete timetable error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete timetable'
        });
    }
};

// Publish timetable
exports.publishTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: 'Timetable not found'
            });
        }

        // Check for conflicts before publishing
        const entries = await TimetableEntry.find({ timetableId: timetable._id });

        if (entries.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot publish empty timetable. Add sessions first.'
            });
        }

        await timetable.publish(req.user._id);
        await timetable.populate('createdBy publishedBy', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Timetable published successfully',
            data: { timetable }
        });
    } catch (error) {
        console.error('Publish timetable error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to publish timetable'
        });
    }
};

// Unpublish timetable
exports.unpublishTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: 'Timetable not found'
            });
        }

        await timetable.unpublish();
        await timetable.populate('createdBy', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Timetable unpublished successfully',
            data: { timetable }
        });
    } catch (error) {
        console.error('Unpublish timetable error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to unpublish timetable'
        });
    }
};

// Archive timetable
exports.archiveTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: 'Timetable not found'
            });
        }

        await timetable.archive();
        await timetable.populate('createdBy publishedBy', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Timetable archived successfully',
            data: { timetable }
        });
    } catch (error) {
        console.error('Archive timetable error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to archive timetable'
        });
    }
};

// Get timetable entries
exports.getTimetableEntries = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: 'Timetable not found'
            });
        }

        if (req.user.role === 'student' && timetable.status !== 'Published') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. This timetable is not published yet.'
            });
        }

        const entries = await TimetableEntry.find({ timetableId: req.params.id })
            .populate('courseId', 'code name credits')
            .populate('roomId', 'name building floor capacity')
            .populate('lecturerId', 'firstName lastName email')
            .sort({ dayOfWeek: 1, startTime: 1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: { entries }
        });
    } catch (error) {
        console.error('Get timetable entries error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve timetable entries'
        });
    }
};

// Update timetable metadata
exports.updateTimetableMetadata = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);

        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: 'Timetable not found'
            });
        }

        await timetable.updateMetadata();

        res.status(200).json({
            success: true,
            message: 'Timetable metadata updated successfully',
            data: { timetable }
        });
    } catch (error) {
        console.error('Update metadata error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update timetable metadata'
        });
    }
};