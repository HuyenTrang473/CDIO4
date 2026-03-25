// server/app.js - FIXED VERSION

// 1. Tải Biến Môi trường
require('dotenv').config(); 

// 2. Import Modules
const express = require('express');
const connectDB = require('./config/db.config'); 
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const supplierRoutes = require('./routes/supplierRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes'); // <--- ĐÃ THÊM
const aiRoutes = require('./routes/aiRoutes'); // <--- THÊM AI ROUTES

// 3. Khởi tạo Ứng dụng Express
const app = express();

// 4. Middleware cơ bản (Body Parser)
app.use(express.json());

// 5. Định tuyến (Routes) - SỬA ĐÚNG PATH
app.use('/api/products', productRoutes);    
app.use('/api/transactions', transactionRoutes);  
app.use('/api/auth', authRoutes);           
app.use('/api/suppliers', supplierRoutes); 
app.use('/api/categories', categoryRoutes); // <--- ĐÃ THÊM
app.use('/api/ai', aiRoutes); // <--- THÊM AI ROUTES
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();  
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📱 API Endpoints:`);
            console.log(`   POST /api/auth/login`);
            console.log(`   GET  /api/products`);
            console.log(`   GET  /api/suppliers`); 
            console.log(`   GET  /api/categories`); // <--- CẬP NHẬT LOG
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();