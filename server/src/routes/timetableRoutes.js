const express = require('express');
const router = express.Router();
const {
    getAllTimetables,
    getTimetableById,
    createTimetable,
    updateTimetable,
    deleteTimetable,
    publishTimetable,
    unpublishTimetable,
    archiveTimetable,
    getTimetableEntries,
    updateTimetableMetadata,
    getTimetableVersions,
    restoreTimetableVersion,
    exportTimetablePDF,
    exportTimetableExcel
} = require('../controllers/timetableController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    validateCreateTimetable,
    validateUpdateTimetable
} = require('../middleware/validationMiddleware');

router.get('/', protect, getAllTimetables);
router.get('/:id', protect, getTimetableById);
router.get('/:id/entries', protect, getTimetableEntries);

// Versioning endpoints (stubs)
router.get('/:id/versions', protect, restrictTo('admin', 'lecturer'), getTimetableVersions);
router.post('/:id/restore/:version', protect, restrictTo('admin', 'lecturer'), restoreTimetableVersion);

// Export endpoints (stubs)
router.get('/:id/export/pdf', protect, exportTimetablePDF);
router.get('/:id/export/excel', protect, exportTimetableExcel);

// Admin and lecturer only
router.post(
    '/',
    protect,
    restrictTo('admin', 'lecturer'),
    validateCreateTimetable,
    createTimetable
);

router.put(
    '/:id',
    protect,
    restrictTo('admin', 'lecturer'),
    validateUpdateTimetable,
    updateTimetable
);

router.delete(
    '/:id',
    protect,
    restrictTo('admin', 'lecturer'),
    deleteTimetable
);

router.post(
    '/:id/publish',
    protect,
    restrictTo('admin', 'lecturer'),
    publishTimetable
);

router.post(
    '/:id/unpublish',
    protect,
    restrictTo('admin', 'lecturer'),
    unpublishTimetable
);

router.post(
    '/:id/archive',
    protect,
    restrictTo('admin', 'lecturer'),
    archiveTimetable
);

router.post(
    '/:id/update-metadata',
    protect,
    restrictTo('admin', 'lecturer'),
    updateTimetableMetadata
);

module.exports = router;