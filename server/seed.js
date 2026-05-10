// server/seed.js - Database management script
// Use this to clear all data if needed

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db.config');
const Product = require('./models/Product');
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');
const User = require('./models/User');

const clearData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        // Clear all existing data
        await Transaction.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await Supplier.deleteMany();
        await User.deleteMany();

        console.log('All data cleared successfully - Database is now empty');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing data:', error);
        process.exit(1);
    }
};

// Uncomment the line below if you want to clear all data
// clearData();

const seedData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        // ── 1. USERS ──────────────────────────────────────────
        const users = [
            { name: 'Admin User',    email: 'admin@warehouse.com',    password: 'password123', role: 'admin' },
            { name: 'Supplier User', email: 'supplier@warehouse.com', password: 'password123', role: 'supplier' },
            { name: 'Customer User', email: 'customer@warehouse.com', password: 'password123', role: 'customer' }
        ];

        for (const userData of users) {
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                await User.create(userData);
                console.log(`✅ Created user: ${userData.email} (${userData.role})`);
            } else {
                console.log(`⏭  User already exists: ${userData.email}`);
            }
        }

        // ── 2. CATEGORIES ─────────────────────────────────────
        const categories = [
            { name: 'Arabica',  description: 'Cà phê Arabica cao cấp từ các vùng núi cao' },
            { name: 'Robusta',  description: 'Cà phê Robusta đậm đà, hàm lượng caffeine cao' },
            { name: 'Blend',    description: 'Hỗn hợp nhiều loại cà phê' },
            { name: 'Liberica', description: 'Cà phê Liberica hiếm từ Tây Phi' },
            { name: 'Excelsa',  description: 'Cà phê Excelsa hương vị độc đáo' },
        ];

        for (const catData of categories) {
            const exists = await Category.findOne({ name: catData.name });
            if (!exists) {
                await Category.create(catData);
                console.log(`✅ Created category: ${catData.name}`);
            } else {
                console.log(`⏭  Category already exists: ${catData.name}`);
            }
        }

        // ── 3. SUPPLIERS ──────────────────────────────────────
        const suppliers = [
            { name: 'Highlands Coffee Supply', contactName: 'Nguyễn Văn A', phone: '0901234567', email: 'contact@highlands.vn',  address: 'Đà Lạt, Lâm Đồng' },
            { name: 'Gia Lai Coffee Co.',       contactName: 'Trần Thị B',   phone: '0912345678', email: 'info@gialai-coffee.vn', address: 'Pleiku, Gia Lai' },
            { name: 'Buon Ma Thuot Export',     contactName: 'Lê Văn C',     phone: '0923456789', email: 'export@bmt-coffee.vn',  address: 'Buôn Ma Thuột, Đắk Lắk' },
            { name: 'Vietnam Arabica Ltd.',     contactName: 'Phạm Thị D',   phone: '0934567890', email: 'sales@vn-arabica.com',  address: 'Cầu Đất, Lâm Đồng' },
        ];

        for (const supData of suppliers) {
            const exists = await Supplier.findOne({ name: supData.name });
            if (!exists) {
                await Supplier.create(supData);
                console.log(`✅ Created supplier: ${supData.name}`);
            } else {
                console.log(`⏭  Supplier already exists: ${supData.name}`);
            }
        }

        console.log('\n🎉 Seed hoàn tất!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};




seedData();