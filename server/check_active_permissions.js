import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function checkPermissions() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGO_URI or MONGODB_URI not found in environment');
        }
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const HybridPermission = mongoose.model('HybridPermission', new mongoose.Schema({}, { strict: false }));
        const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));

        const permissions = await HybridPermission.find({ status: 'active' });
        console.log(`Found ${permissions.length} active permissions`);

        for (const p of permissions) {
            console.log(`- Employee: ${p.employeeName} (${p.employeeEmail}), Permissions: ${JSON.stringify(p.permissions)}`);
        }

        const jane = await Employee.findOne({ name: /Jane/i });
        if (jane) {
            console.log(`Jane Developer ID: ${jane._id}`);
            const janeP = await HybridPermission.findOne({ employeeId: jane._id, status: 'active' });
            console.log(`Jane's active permission: ${janeP ? 'Exists' : 'None'}`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkPermissions();
