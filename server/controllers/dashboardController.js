const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

exports.getNavStats = async (req, res) => {
    try {
        // 1. Tính tổng tồn kho thực tế (Sum tất cả weight của các sản phẩm)
        const products = await Product.find();
        const totalWeight = products.reduce((sum, p) => sum + (p.weight || 0), 0);

        // 2. Tính tổng giá trị kho (Giá * Số lượng)
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock || 0), 0);

        // 3. Lấy số lượng nhập/xuất trong ngày hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const transactions = await Transaction.find({ createdAt: { $gte: today } });
        const todayIn = transactions
            .filter(t => t.type === 'inbound')
            .reduce((sum, t) => sum + (t.weight || 0), 0);
        const todayOut = transactions
            .filter(t => t.type === 'outbound')
            .reduce((sum, t) => sum + (t.weight || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                totalWeight: totalWeight.toFixed(1), // Ví dụ: 145.5
                totalValue: totalValue,               // Ví dụ: 850000000
                todayIn: todayIn.toFixed(1),
                todayOut: todayOut.toFixed(1)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};