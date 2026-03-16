import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const checkConnection = async () => {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
};

checkConnection();
