import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function checkMike() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));
        const HybridPermission = mongoose.model('HybridPermission', new mongoose.Schema({}, { strict: false }));

        const mikeEmp = await Employee.findOne({ name: /Mike/i });
        console.log('--- Mike Employee ---');
        console.log(JSON.stringify(mikeEmp, null, 2));

        if (mikeEmp) {
            const mikeUser = await User.findOne({ email: mikeEmp.email });
            console.log('\n--- Mike User ---');
            console.log(JSON.stringify(mikeUser, null, 2));

            const mikeHP = await HybridPermission.findOne({ employeeId: mikeEmp._id });
            console.log('\n--- Mike HybridPermission Doc ---');
            console.log(JSON.stringify(mikeHP, null, 2));
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkMike();
