// server/controllers/aiController.js

const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Supplier = require('../models/Supplier');

/**
 * @desc    Get warehouse data for AI analysis
 * @route   GET /api/ai/warehouse-data
 * @access  Private
 */
exports.getWarehouseData = async (req, res) => {
    try {
        // Get all products with low stock
        const products = await Product.find()
            .populate('supplier', 'name contactName phone email')
            .populate('category', 'name')
            .select('name sku stockQuantity minimumStock costPrice salePrice supplier category unit')
            .lean();

        // Get all suppliers
        const suppliers = await Supplier.find()
            .select('name contactName phone email address')
            .lean();

        // Get recent transactions
        const transactions = await Transaction.find()
            .populate('product', 'name sku')
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        // Transform data for AI
        const data = {
            products: products.map(p => ({
                id: p._id,
                name: p.name,
                sku: p.sku,
                quantity: p.stockQuantity,
                minimumStock: p.minimumStock,
                price: p.costPrice,
                salePrice: p.salePrice,
                unit: p.unit,
                preferredSupplier: p.supplier?.name || 'N/A',
                supplierId: p.supplier?._id,
                category: p.category?.name || 'N/A'
            })),
            suppliers: suppliers.map(s => ({
                id: s._id,
                name: s.name,
                contactPerson: s.contactName || '',
                phone: s.phone || '',
                email: s.email || '',
                address: s.address || ''
            })),
            transactions: transactions.map(t => ({
                id: t._id,
                type: t.type === 'in' ? 'inbound' : 'outbound',
                productName: t.product?.name || 'Unknown',
                productSku: t.product?.sku || 'N/A',
                quantity: t.quantity,
                price: t.price,
                unitPrice: t.price,
                status: t.type === 'in' ? 'pending' : 'completed',
                notes: t.notes || '',
                createdAt: t.createdAt,
                timestamp: new Date(t.createdAt).toLocaleDateString('vi-VN')
            }))
        };

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tải dữ liệu kho',
            error: error.message
        });
    }
};

/**
 * @desc    Get low stock products alert
 * @route   GET /api/ai/low-stock-alert
 * @access  Private
 */
exports.getLowStockAlert = async (req, res) => {
    try {
        const lowStockProducts = await Product.find({
            $expr: { $lt: ['$stockQuantity', '$minimumStock'] }
        })
            .populate('supplier', 'name phone email')
            .select('name sku stockQuantity minimumStock costPrice supplier')
            .sort({ stockQuantity: 1 })
            .lean();

        const alert = lowStockProducts.map(p => ({
            id: p._id,
            name: p.name,
            sku: p.sku,
            currentStock: p.stockQuantity,
            minimumStock: p.minimumStock,
            shortage: p.minimumStock - p.stockQuantity,
            costPerUnit: p.costPrice,
            totalValue: p.stockQuantity * p.costPrice,
            preferredSupplier: {
                name: p.supplier?.name || 'N/A',
                phone: p.supplier?.phone || '',
                email: p.supplier?.email || ''
            }
        }));

        res.status(200).json({
            success: true,
            count: alert.length,
            data: alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy cảnh báo tồn kho thấp',
            error: error.message
        });
    }
};

/**
 * @desc    Get pending inbound orders
 * @route   GET /api/ai/pending-orders
 * @access  Private
 */
exports.getPendingOrders = async (req, res) => {
    try {
        // Get inbound transactions (pending orders from suppliers)
        const pendingOrders = await Transaction.find({
            type: 'in'
        })
            .populate('product', 'name sku')
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        const orders = pendingOrders.map((t, idx) => ({
            id: t._id,
            poNumber: `PO#${t._id.toString().slice(-6).toUpperCase()}`,
            productName: t.product?.name || 'Unknown',
            productSku: t.product?.sku || 'N/A',
            quantity: t.quantity,
            unitPrice: t.price,
            totalValue: t.quantity * t.price,
            notes: t.notes || '',
            createdAt: new Date(t.createdAt).toLocaleDateString('vi-VN'),
            timestamp: t.createdAt,
            status: 'pending'
        }));

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy đơn hàng chờ xử lý',
            error: error.message
        });
    }
};

/**
 * @desc    Get revenue statistics
 * @route   GET /api/ai/revenue-stats
 * @access  Private
 */
exports.getRevenueStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Weekly transactions
        const weeklyTransactions = await Transaction.find({
            type: 'out',
            createdAt: { $gte: startOfWeek }
        }).lean();

        // Monthly transactions
        const monthlyTransactions = await Transaction.find({
            type: 'out',
            createdAt: { $gte: startOfMonth }
        }).lean();

        const weeklyRevenue = weeklyTransactions.reduce((sum, t) => sum + (t.quantity * t.price), 0);
        const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + (t.quantity * t.price), 0);

        res.status(200).json({
            success: true,
            data: {
                weekly: {
                    revenue: weeklyRevenue,
                    transactions: weeklyTransactions.length,
                    startDate: startOfWeek.toLocaleDateString('vi-VN'),
                    endDate: new Date().toLocaleDateString('vi-VN')
                },
                monthly: {
                    revenue: monthlyRevenue,
                    transactions: monthlyTransactions.length,
                    startDate: startOfMonth.toLocaleDateString('vi-VN'),
                    endDate: new Date().toLocaleDateString('vi-VN')
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tính toán doanh thu',
            error: error.message
        });
    }
};

/**
 * @desc    Get supplier performance analytics
 * @route   GET /api/ai/supplier-analytics
 * @access  Private
 */
exports.getSupplierAnalytics = async (req, res) => {
    try {
        const suppliers = await Supplier.find().lean();

        const analytics = await Promise.all(
            suppliers.map(async (supplier) => {
                const supplierTransactions = await Transaction.find({
                    type: 'in'
                })
                    .populate({
                        path: 'product',
                        match: { supplier: supplier._id }
                    })
                    .lean();

                const validTransactions = supplierTransactions.filter(t => t.product);
                const totalOrders = validTransactions.length;
                const totalQuantity = validTransactions.reduce((sum, t) => sum + t.quantity, 0);
                const totalValue = validTransactions.reduce((sum, t) => sum + (t.quantity * t.price), 0);

                // Estimate on-time rate (can be enhanced with actual delivery dates)
                const onTimeRate = totalOrders > 0 ? 98 : 0; // Mock: 98% for demo

                return {
                    id: supplier._id,
                    name: supplier.name,
                    contactPerson: supplier.contactName || '',
                    phone: supplier.phone || '',
                    email: supplier.email || '',
                    address: supplier.address || '',
                    totalOrders,
                    totalQuantity,
                    totalValue,
                    onTimeRate: onTimeRate,
                    rating: (totalOrders > 0 ? (onTimeRate / 100) * 5 : 0).toFixed(1)
                };
            })
        );

        const sorted = analytics.sort((a, b) => b.onTimeRate - a.onTimeRate);

        res.status(200).json({
            success: true,
            count: sorted.length,
            data: sorted
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi phân tích nhà cung cấp',
            error: error.message
        });
    }
};
