// server/seed.js - Seed data for coffee export company

const mongoose = require('mongoose');
const connectDB = require('./config/db.config');
const Product = require('./models/Product');
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');

const seedData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        // Clear existing data
        await Product.deleteMany();
        await Transaction.deleteMany();
        await Category.deleteMany();
        await Supplier.deleteMany();

        // Create categories
        const category = await Category.create({
            name: 'Cà phê nhân',
            description: 'Các loại hạt cà phê'
        });

        // Create suppliers
        const supplier1 = await Supplier.create({
            name: 'Nông trại ông Hòa - Krông Păk',
            contact: 'Ông Hòa',
            address: 'Krông Păk, Đắk Lắk'
        });

        const supplier2 = await Supplier.create({
            name: 'HTX Cà phê Ea Tul',
            contact: 'HTX Ea Tul',
            address: 'Ea Tul, Đắk Lắk'
        });

        const supplier3 = await Supplier.create({
            name: 'Nông trại Simexco Daklak',
            contact: 'Simexco',
            address: 'Đắk Lắk'
        });

        // Create products
        const product1 = await Product.create({
            name: 'Robusta Sàng 5 Buôn Ma Thuột',
            sku: 'ROB5-BMT-2026A',
            category: category._id,
            supplier: supplier1._id,
            stockQuantity: 1200,
            minimumStock: 2000,
            costPrice: 85000,
            unit: 'kg',
            expiryDate: new Date('2026-06-15')
        });

        const product2 = await Product.create({
            name: 'Arabica Cầu Đất Đặc Sản',
            sku: 'ARA-CD-2026B',
            category: category._id,
            supplier: supplier2._id,
            stockQuantity: 0,
            minimumStock: 500,
            costPrice: 180000,
            unit: 'kg',
            expiryDate: new Date('2026-05-20')
        });

        const product3 = await Product.create({
            name: 'Robusta Sàng 6 Xuất Nhật',
            sku: 'ROB6-JP-2026C',
            category: category._id,
            supplier: supplier3._id,
            stockQuantity: 800,
            minimumStock: 1500,
            costPrice: 95000,
            unit: 'kg'
        });

        // Create transactions
        await Transaction.create({
            product: product1._id,
            type: 'in',
            quantity: 3000,
            price: 85000,
            notes: 'Nhập từ nông trại',
            createdAt: new Date('2026-03-10T08:00:00Z')
        });

        await Transaction.create({
            product: product1._id,
            type: 'out',
            quantity: 1800,
            price: 120000,
            notes: 'Xuất cho khách hàng Nhật',
            createdAt: new Date('2026-03-22T14:00:00Z')
        });

        await Transaction.create({
            product: product2._id,
            type: 'out',
            quantity: 500,
            price: 250000,
            notes: 'Xuất Arabica đặc sản',
            createdAt: new Date('2026-03-24T10:30:00Z')
        });

        console.log('Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();