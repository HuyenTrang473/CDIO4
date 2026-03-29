const express = require('express');
const router = express.Router();
const { getNavStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/kpi', protect, getNavStats);

module.exports = router;