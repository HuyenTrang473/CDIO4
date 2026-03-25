// server/routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const {
    getWarehouseData,
    getLowStockAlert,
    getPendingOrders,
    getRevenueStats,
    getSupplierAnalytics
} = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// All AI routes require authentication
router.use(authMiddleware.protect);

/**
 * @route   GET /api/ai/warehouse-data
 * @desc    Get complete warehouse data for AI analysis
 * @access  Private
 */
router.get('/warehouse-data', getWarehouseData);

/**
 * @route   GET /api/ai/low-stock-alert
 * @desc    Get products with low stock
 * @access  Private
 */
router.get('/low-stock-alert', getLowStockAlert);

/**
 * @route   GET /api/ai/pending-orders
 * @desc    Get pending inbound orders
 * @access  Private
 */
router.get('/pending-orders', getPendingOrders);

/**
 * @route   GET /api/ai/revenue-stats
 * @desc    Get revenue statistics
 * @access  Private
 */
router.get('/revenue-stats', getRevenueStats);

/**
 * @route   GET /api/ai/supplier-analytics
 * @desc    Get supplier performance analytics
 * @access  Private
 */
router.get('/supplier-analytics', getSupplierAnalytics);

module.exports = router;
