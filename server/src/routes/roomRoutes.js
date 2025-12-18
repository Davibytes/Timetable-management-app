const express = require('express');
const router = express.Router();
const {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomsByBuilding,
    getAvailableRooms
} = require('../controllers/roomController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    validateCreateRoom,
    validateUpdateRoom
} = require('../middleware/validationMiddleware');

router.get('/', protect, getAllRooms);
router.get('/available', protect, getAvailableRooms);
router.get('/:id', protect, getRoomById);
router.get('/building/:building', protect, getRoomsByBuilding);

// Admin and lecturer only
router.post(
    '/',
    protect,
    restrictTo('admin', 'lecturer'),
    validateCreateRoom,
    createRoom
);

router.put(
    '/:id',
    protect,
    restrictTo('admin', 'lecturer'),
    validateUpdateRoom,
    updateRoom
);

router.delete(
    '/:id',
    protect,
    restrictTo('admin', 'lecturer'),
    deleteRoom
);

module.exports = router;