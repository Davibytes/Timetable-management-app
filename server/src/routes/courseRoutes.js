const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByLecturer
} = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    validateCreateCourse,
    validateUpdateCourse
} = require('../middleware/validationMiddleware');

router.get('/', protect, getAllCourses);
router.get('/:id', protect, getCourseById);
router.get('/lecturer/:lecturerId', protect, getCoursesByLecturer);

// Admin and lecturer only
router.post(
    '/',
    protect,
    restrictTo('admin', 'lecturer'),
    validateCreateCourse,
    createCourse
);

router.put(
    '/:id',
    protect,
    restrictTo('admin', 'lecturer'),
    validateUpdateCourse,
    updateCourse
);

router.delete(
    '/:id',
    protect,
    restrictTo('admin', 'lecturer'),
    deleteCourse
);

module.exports = router;