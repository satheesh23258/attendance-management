import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

import Service from '../server/models/Service.js';
import Employee from '../server/models/Employee.js';

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-system');
        console.log('Connected to DB');

        const employees = await Employee.find().limit(5);
        console.log('\n--- Employees ---');
        employees.forEach(e => console.log(`${e.name} (${e._id})` ));

        const services = await Service.find().limit(5);
        console.log('\n--- Services ---');
        services.forEach(s => {
            console.log(`Title: ${s.title}`);
            console.log(`AssignedTo: ${s.assignedTo} (${typeof s.assignedTo})`);
            console.log(`AssignedToName: ${s.assignedToName}`);
            console.log('---');
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkData();
