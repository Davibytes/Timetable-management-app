const express = require('express');
const router = express.Router();

// Placeholder admin route
router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Admin route placeholder' });
});

module.exports = router;
