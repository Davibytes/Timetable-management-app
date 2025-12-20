const express = require('express');
const router = express.Router();
const {
    getAllEntries,
    getEntryById,
    createEntry,
    updateEntry,
    deleteEntry,
    checkConflicts,
    getEntriesByDay
} = require('../controllers/timetableEntryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    validateCreateEntry,
    validateUpdateEntry
} = require('../middleware/validationMiddleware');

router.get('/', protect, getAllEntries);
router.get('/:id', protect, getEntryById);

router.post('/check-conflicts', protect, restrictTo('admin', 'lecturer'), checkConflicts);

router.get('/timetable/:timetableId/day', protect, getEntriesByDay);

// Admin and lecturer only
router.post(
    '/',
    protect,
    restrictTo('admin', 'lecturer'),
    validateCreateEntry,
    createEntry
);

router.put(
    '/:id',
    protect,
    restrictTo('admin', 'lecturer'),
    validateUpdateEntry,
    updateEntry
);

router.delete(
    '/:id',
    protect,
    restrictTo('admin', 'lecturer'),
    deleteEntry
);

module.exports = router;