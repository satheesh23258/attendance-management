import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function checkJane() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        
        const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        const janeEmp = await Employee.findOne({ name: /Jane/i });
        console.log('Jane Employee Doc:', JSON.stringify(janeEmp, null, 2));

        const janeUser = await User.findOne({ email: janeEmp.email });
        console.log('Jane User Doc:', JSON.stringify(janeUser, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkJane();
