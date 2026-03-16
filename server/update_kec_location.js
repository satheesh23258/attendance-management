import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

import Employee from './models/Employee.js';
import connectDB from './config/db.js';

const updateLocation = async () => {
    try {
        await connectDB();
        const result = await Employee.updateMany({}, {
            $set: {
                'officeLocation.lat': 11.27218,
                'officeLocation.lng': 77.604,
                'officeLocation.radius': 100
            }
        });
        console.log(`Successfully updated ${result.modifiedCount} employees.`);
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
};

updateLocation();
