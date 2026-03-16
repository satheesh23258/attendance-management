import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function syncPermissions() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const HybridPermission = mongoose.model('HybridPermission', new mongoose.Schema({}, { strict: false }));
        const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        const permissions = await HybridPermission.find({ status: 'active' });
        console.log(`Syncing ${permissions.length} active permissions...`);

        for (const p of permissions) {
            console.log(`Syncing for ${p.employeeName}...`);
            await Employee.findByIdAndUpdate(p.employeeId, {
                $set: {
                    hybridPermissions: {
                        hasAccess: true,
                        permissions: p.permissions
                    }
                }
            });
            await User.findOneAndUpdate({ email: p.employeeEmail }, {
                $set: {
                    'hybridPermissions.hasAccess': true,
                    'hybridPermissions.roles': ['employee', 'hr'],
                    'hybridPermissions.permissions': p.permissions
                }
            });
        }

        console.log('Sync complete.');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

syncPermissions();
