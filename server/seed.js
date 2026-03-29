// server/seed.js - Database management script
// Use this to clear all data if needed

const mongoose = require('mongoose');
const connectDB = require('./config/db.config');
const Product = require('./models/Product');
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');

const clearData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        // Clear all existing data
        await Transaction.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await Supplier.deleteMany();

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
        console.log('Connected to DB - No seed data to insert');

        console.log('Database is ready for manual data entry via web interface');
        process.exit(0);
    } catch (error) {
        console.error('Error connecting to DB:', error);
        process.exit(1);
    }
};

seedData();