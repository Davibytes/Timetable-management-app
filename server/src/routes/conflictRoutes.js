const express = require('express');
const router = express.Router();
const {
    getTimetableReport,
    validateTimetable,
    getLecturerWorkload,
    getSuggestions
} = require('../controllers/conflictController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Admins and lecturers can query reports and validate before publish
router.post('/:timetableId/report', protect, restrictTo('admin', 'lecturer'), getTimetableReport);
router.post('/:timetableId/validate', protect, restrictTo('admin', 'lecturer'), validateTimetable);

// Suggestions endpoint (use POST to accept parameters)
router.post('/:timetableId/suggestions', protect, restrictTo('admin', 'lecturer'), getSuggestions);

// Lecturer workload - lecturers can view their own workload; admins can view any
router.get('/lecturers/:lecturerId/workload', protect, restrictTo('admin', 'lecturer'), getLecturerWorkload);

module.exports = router;
