const Course = require('../models/courseModel');

// Get all courses with filtering
exports.getAllCourses = async (req, res) => {
    try {
        const { department, semester, lecturerId, isActive } = req.query;

        const filter = {};
        if (department) filter.department = department;
        if (semester) filter.semester = parseInt(semester);
        if (lecturerId) filter.lecturerId = lecturerId;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const courses = await Course.find(filter)
            .populate('lecturerId', 'firstName lastName email')
            .sort({ department: 1, semester: 1, code: 1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: { courses }
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve courses'
        });
    }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('lecturerId', 'firstName lastName email department');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { course }
        });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve course'
        });
    }
};

// Create new course
exports.createCourse = async (req, res) => {
    try {
        const { name, department, semester, credits, lecturerId, duration, description } = req.body;

        // Code will be auto-generated if not provided
        const courseData = {
            name,
            department,
            semester,
            credits,
            lecturerId,
            duration,
            description
        };

        // Allow manual code override if provided
        if (req.body.code) {
            courseData.code = req.body.code;
        }

        const course = await Course.create(courseData);

        await course.populate('lecturerId', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: { course }
        });
    } catch (error) {
        console.error('Create course error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Course code already exists'
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
            message: error.message || 'Failed to create course'
        });
    }
};

// Update course
exports.updateCourse = async (req, res) => {
    try {
        const { name, department, semester, credits, lecturerId, duration, description, isActive } = req.body;

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (name !== undefined) course.name = name;
        if (department !== undefined) course.department = department;
        if (semester !== undefined) course.semester = semester;
        if (credits !== undefined) course.credits = credits;
        if (lecturerId !== undefined) course.lecturerId = lecturerId;
        if (duration !== undefined) course.duration = duration;
        if (description !== undefined) course.description = description;
        if (isActive !== undefined) course.isActive = isActive;

        await course.save();

        await course.populate('lecturerId', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: { course }
        });
    } catch (error) {
        console.error('Update course error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update course'
        });
    }
};

// Delete course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if course is used in any timetable entries
        const TimetableEntry = require('../models/timetableEntryModel');
        const entriesCount = await TimetableEntry.countDocuments({ courseId: req.params.id });

        if (entriesCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete course. It is used in ${entriesCount} timetable entries. Consider deactivating instead.`
            });
        }

        await course.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete course'
        });
    }
};

// Get courses by lecturer
exports.getCoursesByLecturer = async (req, res) => {
    try {
        const courses = await Course.find({
            lecturerId: req.params.lecturerId,
            isActive: true
        })
            .populate('lecturerId', 'firstName lastName email')
            .sort({ semester: 1, code: 1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: { courses }
        });
    } catch (error) {
        console.error('Get lecturer courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve lecturer courses'
        });
    }
};