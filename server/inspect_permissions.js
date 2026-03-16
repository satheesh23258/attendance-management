import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function inspectPermissions() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        
        const HybridPermission = mongoose.model('HybridPermission', new mongoose.Schema({}, { strict: false }));
        
        const permissions = await HybridPermission.find({ status: 'active' });
        console.log('--- ACTIVE PERMISSIONS ---');
        permissions.forEach(p => {
            console.log(`For: ${p.employeeName} (${p.employeeEmail})`);
            console.log(`  Granted By: ${p.grantedByName}`);
            console.log(`  Permissions: ${JSON.stringify(p.permissions)}`);
            console.log(`  Created At: ${p.createdAt}`);
            console.log('-------------------------');
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

inspectPermissions();
