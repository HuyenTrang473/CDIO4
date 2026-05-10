// server/controllers/ProductController.js

const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { formatErrors } = require('../utils/validationUtils'); // Nếu bạn có file này

// @desc Get all Products
// @route GET /api/products
// @access Private

const getProducts = asyncHandler(async (req, res) => {

    const products = await Product.find()
        .populate('category', 'name') // Lấy trường 'name' từ bảng Category
        .populate('supplier', 'name') // Lấy trường 'name' từ bảng Supplier
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: 'Lấy danh sách sản phẩm thành công',
        data: products,
        total: products.length
    });
});

// @desc Create New Product
// @route POST /api/products
// @access Private
const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, description, costPrice, salePrice, unit, category, supplier } = req.body;

    // Kiểm tra trường bắt buộc
    if (!name || !sku || !costPrice || !salePrice || !unit) {
        res.status(400);
        throw new Error('Vui lòng nhập đầy đủ các trường bắt buộc (Tên, Mã SKU, Giá nhập, Giá bán, Đơn vị tính).');
    }

    // Kiểm tra nếu SKU hoặc Tên đã tồn tại
    const productExists = await Product.findOne({ $or: [{ sku }, { name }] });
    if (productExists) {
        res.status(400);
        throw new Error('Mã SKU hoặc Tên sản phẩm đã tồn tại.');
    }

    // Tạo sản phẩm mới. stockQuantity sẽ được tự động gán là 0 (theo Model).
    const product = await Product.create({
        name,
        sku,
        description,
        costPrice: parseFloat(costPrice),
        salePrice: parseFloat(salePrice),
        unit,
        category, // Lưu ID loại sản phẩm
        supplier, // Lưu ID nhà cung cấp
    });

    if (product) {
        res.status(201).json({
            message: 'Thêm sản phẩm thành công',
            data: product
        });
    } else {
        res.status(400);
        throw new Error('Dữ liệu sản phẩm không hợp lệ.');
    }
});


// @desc Update Product
// @route PUT /api/products/:id
// @access Private
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }

    // Loại bỏ stockQuantity để không cho phép sửa tồn kho trực tiếp qua đây
    const { stockQuantity, ...updateData } = req.body;

    // Kiểm tra trùng lặp SKU/Tên (Loại trừ sản phẩm hiện tại)
    const checkDuplicateConditions = [];
    if (updateData.sku && updateData.sku !== product.sku) {
        checkDuplicateConditions.push({ sku: updateData.sku });
    }
    if (updateData.name && updateData.name !== product.name) {
        checkDuplicateConditions.push({ name: updateData.name });
    }

    if (checkDuplicateConditions.length > 0) {
        const duplicateProduct = await Product.findOne({
            $or: checkDuplicateConditions,
            _id: { $ne: req.params.id }
        });

        if (duplicateProduct) {
            res.status(400);
            const field = (duplicateProduct.sku === updateData.sku) ? 'Mã SKU' : 'Tên sản phẩm';
            throw new Error(`${field} mới đã được sử dụng bởi sản phẩm khác.`);
        }
    }

    if (updateData.costPrice) updateData.costPrice = parseFloat(updateData.costPrice);
    if (updateData.salePrice) updateData.salePrice = parseFloat(updateData.salePrice);

    // THỰC HIỆN CẬP NHẬT
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
    )
        .populate('category', 'name') // POPULATE Ở ĐÂY để Frontend nhận kết quả mới nhất
        .populate('supplier', 'name');

    if (updatedProduct) {
        res.status(200).json({
            message: 'Cập nhật sản phẩm thành công',
            data: updatedProduct
        });
    } else {
        res.status(400);
        throw new Error('Lỗi cập nhật sản phẩm.');
    }
});
// @desc Delete Product
// @route DELETE /api/products/:id
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }

    // LOGIC: KHÔNG CHO XÓA nếu stockQuantity > 0.
    if (product.stockQuantity > 0) {
        res.status(400);
        throw new Error('Không thể xóa sản phẩm khi tồn kho vẫn còn. Vui lòng tạo phiếu xuất kho trước khi xóa.');
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
        message: 'Xóa sản phẩm thành công',
        id: req.params.id
    });
});


module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};