// server/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên sản phẩm là bắt buộc'],
            unique: true, 
            trim: true,
        },
        sku: {
            type: String,
            required: [true, 'Mã SKU là bắt buộc'],
            unique: true, 
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        
        // --- LIÊN KẾT VỚI LOẠI SẢN PHẨM ---
        category: {
            type: mongoose.Schema.Types.ObjectId, // Lưu trữ ID của Category
            ref: 'Category', // Tên model phải khớp chính xác với mongoose.model('Category', ...)
            required: false,
        },

        // --- BỔ SUNG: LIÊN KẾT VỚI NHÀ CUNG CẤP ---
        supplier: {
            type: mongoose.Schema.Types.ObjectId, // Lưu trữ ID của Supplier
            ref: 'Supplier', // Tên model phải khớp chính xác với mongoose.model('Supplier', ...)
            required: false,
        },

        costPrice: {
            type: Number,
            required: false, 
            default: 0,
            min: [0, 'Giá nhập không thể âm'],
        },
        
        salePrice: {
            type: Number,
            required: false, 
            default: 0,
            min: [0, 'Giá bán không thể âm'],
        },
        
        stockQuantity: {
            type: Number,
            required: false, 
            default: 0, 
            min: [0, 'Số lượng tồn kho không thể âm'],
        },
        
        minimumStock: {
            type: Number,
            required: false,
            default: 10,
            min: [0, 'Tồn tối thiểu không thể âm'],
        },
        
        unit: {
            type: String,
            required: [true, 'Đơn vị tính là bắt buộc'],
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;