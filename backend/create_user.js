const path = require('path');
const dotenv = require('dotenv');

// Try loading from different paths to be sure
const envPaths = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '.env'), // If current dir is backend/
    path.join(process.cwd(), 'backend', '.env')
];

let loaded = false;
for (const p of envPaths) {
    const result = dotenv.config({ path: p });
    if (result.error) continue;
    if (process.env.MONGO_URI) {
        console.log(`Loaded .env from ${p}`);
        loaded = true;
        break;
    }
}

if (!loaded) {
    console.error("Could not load .env file or MONGO_URI is missing.");
    console.log("Tried paths:", envPaths);
    // console.log("Current directory:", process.cwd());
}
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const createUser = async () => {
    try {
        await connectDB();

        const userExists = await User.findOne({ email: 'admin@example.com' });

        if (userExists) {
            console.log('User already exists');
            process.exit(0);
        }

        const user = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        console.log(`User created: ${user.name} (${user.email})`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createUser();
