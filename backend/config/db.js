const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error(`Full Error:`, error);
        // process.exit(1); // Keep server running so we can see the error without crashing
    }
};

module.exports = connectDB;
