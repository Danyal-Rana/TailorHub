const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log(`URI: ${process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@')}`); // Mask password
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error('If you see "bad auth", please check your username and password in .env');
        process.exit(1);
    }
};

connectDB();
