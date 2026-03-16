import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Employee from './models/Employee.js';

dotenv.config();

const activateUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'samruthid.23ece@kongu.edu';
    
    // Update User
    const user = await User.findOneAndUpdate(
      { email },
      { status: 'active' },
      { new: true }
    );

    if (user) {
      console.log(`User ${email} updated to active status.`);
      
      // Update Employee entry as well
      await Employee.findOneAndUpdate(
        { email },
        { isActive: true }
      );
      console.log(`Employee record for ${email} marked as active.`);
    } else {
      console.log(`User ${email} not found.`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error:', err.message);
  }
};

activateUser();
