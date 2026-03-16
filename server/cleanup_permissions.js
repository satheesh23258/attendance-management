import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function cleanupPermissions() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const HybridPermission = mongoose.model('HybridPermission', new mongoose.Schema({}, { strict: false }));
        const Employee = mongoose.model('Employee', new mongoose.Schema({}, { strict: false }));
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        // Names to revoke
        const toRevoke = ['Sarah HR', 'Mike Employee', 'niv v'];
        
        for (const name of toRevoke) {
            console.log(`Revoking for ${name}...`);
            const p = await HybridPermission.findOne({ employeeName: name, status: 'active' });
            if (p) {
                p.status = 'revoked';
                await p.save();
                
                await Employee.findOneAndUpdate({ email: p.employeeEmail }, {
                    $set: {
                        'hybridPermissions.hasAccess': false,
                        'hybridPermissions.permissions': {}
                    }
                });
                
                await User.findOneAndUpdate({ email: p.employeeEmail }, {
                    $set: {
                        'hybridPermissions.hasAccess': false,
                        'hybridPermissions.roles': [],
                        'hybridPermissions.permissions': {}
                    }
                });
                console.log(`Successfully revoked ${name}`);
            } else {
                console.log(`No active permission found for ${name}`);
            }
        }

        console.log('Cleanup complete.');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

cleanupPermissions();
