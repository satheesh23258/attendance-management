import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import User from './models/User.js';
import Employee from './models/Employee.js';
import Attendance from './models/Attendance.js';
import Service from './models/Service.js';
import Location from './models/Location.js';
import Notification from './models/Notification.js';
import HybridPermission from './models/HybridPermission.js';


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import assetRoutes from './routes/assetRoutes.js';

import hybridPermissionRoutes from './routes/hybridPermissionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(join(__dirname, 'uploads')));
// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Apply rate limiting to auth endpoints to reduce brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/assets', assetRoutes);

app.use('/api/hybrid-permissions', hybridPermissionRoutes);
import leaveRoutes from './routes/leaveRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

import payrollRoutes from './routes/payrollRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';


app.use('/api/leaves', leaveRoutes);
app.use('/api/expenses', expenseRoutes);

app.use('/api/payroll', payrollRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/tickets', ticketRoutes);
import reportsRoutes from './routes/reportsRoutes.js';
app.use('/api/reports', reportsRoutes);


// Seed database with UI data if empty
const seedDatabase = async () => {
  // Check and seed Employees
  let employeeCount = await Employee.countDocuments();
  let ids = {};
  
  if (employeeCount === 0) {
    const mockEmployees = [
      { name: 'John Admin', email: 'admin@company.com', role: 'admin', department: 'IT', phone: '+1234567890', avatar: 'https://i.pravatar.cc/150?img=1', isActive: true, joinDate: '2022-01-15', employeeId: 'EMP001' },
      { name: 'Sarah HR', email: 'hr@company.com', role: 'hr', department: 'Human Resources', phone: '+1234567891', avatar: 'https://i.pravatar.cc/150?img=5', isActive: true, joinDate: '2022-02-20', employeeId: 'EMP002' },
      { name: 'Mike Employee', email: 'mike@company.com', role: 'employee', department: 'Sales', phone: '+1234567892', avatar: 'https://i.pravatar.cc/150?img=3', isActive: true, joinDate: '2022-03-10', employeeId: 'EMP003' },
      { name: 'Jane Developer', email: 'jane@company.com', role: 'employee', department: 'IT', phone: '+1234567893', avatar: 'https://i.pravatar.cc/150?img=4', isActive: true, joinDate: '2022-04-05', employeeId: 'EMP004' },
    ];
    const created = await Employee.insertMany(mockEmployees);
    ids = { 1: created[0]._id, 2: created[1]._id, 3: created[2]._id, 4: created[3]._id };
    console.log('✓ Seeded: employees');
  } else {
    // Get existing IDs for seeding other collections
    const admins = await Employee.find({ role: 'admin' }).limit(1);
    const hrs = await Employee.find({ role: 'hr' }).limit(1);
    const emps = await Employee.find({ role: 'employee' }).limit(2);
    ids = { 
      1: admins[0]?._id, 
      2: hrs[0]?._id, 
      3: emps[0]?._id, 
      4: emps[1]?._id 
    };
  }

  // Seed Attendance if empty
  if (await Attendance.countDocuments() === 0 && ids[3]) {
    await Attendance.insertMany([
      { employeeId: ids[3], employeeName: 'Mike Employee', date: '2024-01-25', checkIn: '09:00:00', checkOut: '18:00:00', status: 'present', workingHours: 9, overtime: 0, location: { lat: 11.27218, lng: 77.604, address: 'Kongu Engineering College' } },
      { employeeId: ids[4], employeeName: 'Jane Developer', date: '2024-01-25', checkIn: '08:45:00', checkOut: '17:30:00', status: 'present', workingHours: 8.75, overtime: 0, location: { lat: 11.27218, lng: 77.604, address: 'Kongu Engineering College' } },

    ]);
    console.log('✓ Seeded: attendance');
  }

  // Seed Services if empty
  if (await Service.countDocuments() === 0 && ids[4]) {
    await Service.insertMany([
      { title: 'Fix Network Issue', description: 'Resolve network connectivity problems in floor 3', priority: 'high', status: 'pending', assignedTo: ids[4], assignedToName: 'Jane Developer', createdBy: ids[1], createdByName: 'John Admin', dueDate: new Date('2024-01-26'), category: 'IT Support', location: { lat: 11.27218, lng: 77.604, address: 'CSE Department, KEC' } },
      { title: 'Install New Software', description: 'Install accounting software on finance department computers', priority: 'medium', status: 'in_progress', assignedTo: ids[3], assignedToName: 'Mike Employee', createdBy: ids[2], createdByName: 'Sarah HR', dueDate: new Date('2024-01-27'), category: 'IT Support', location: { lat: 11.27218, lng: 77.604, address: 'MBA Department, KEC' } },

    ]);
    console.log('✓ Seeded: services');
  }

  // Seed Notifications if empty
  if (await Notification.countDocuments() === 0) {
    await Notification.insertMany([
      { title: 'New Service Assigned', message: 'You have been assigned a new service: Fix Network Issue', type: 'service', isRead: false, actionUrl: '/services/1' },
      { title: 'Attendance Reminder', message: "Don't forget to check in today", type: 'attendance', isRead: false, actionUrl: '/attendance' },
    ]);
    console.log('✓ Seeded: notifications');
  }

  // Seed Leaves if empty
  const Leave = (await import('./models/Leave.js')).default;
  if (await Leave.countDocuments() === 0 && ids[3]) {
    await Leave.insertMany([
      { employeeId: ids[3], employeeName: 'Mike Employee', leaveType: 'annual', startDate: '2024-02-01', endDate: '2024-02-05', reason: 'Family vacation', days: 5, status: 'approved', department: 'Sales' },
      { employeeId: ids[4], employeeName: 'Jane Developer', leaveType: 'sick', startDate: '2024-01-20', endDate: '2024-01-21', reason: 'Flu', days: 2, status: 'pending', department: 'IT' }
    ]);
    console.log('✓ Seeded: leaves');
  }



  // Seed Expenses if empty
  const Expense = (await import('./models/Expense.js')).default;
  if (await Expense.countDocuments() === 0 && ids[3]) {
    await Expense.insertMany([
      { employeeId: ids[3], employeeName: 'Mike Employee', title: 'Client Lunch', amount: 50, category: 'Food', status: 'pending', description: 'Lunch with potential client' },
      { employeeId: ids[4], employeeName: 'Jane Developer', title: 'Software License', amount: 120, category: 'Software', status: 'approved', description: 'IDE subscription' }
    ]);
    console.log('✓ Seeded: expenses');
  }

  // Seed System Settings if empty
  const SystemSettings = (await import('./models/SystemSettings.js')).default;
  if (await SystemSettings.countDocuments() === 0) {
    await SystemSettings.create({
      companyName: 'Antigravity Tech',
      currentFinancialYear: '2023-2024',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: { start: '09:00', end: '18:00' },
      leaveTypes: [{ name: 'Annual', quota: 20 }, { name: 'Sick', quota: 10 }]
    });
    console.log('✓ Seeded: systemsettings');
  }

  // Seed User Settings if empty
  const UserSettings = (await import('./models/UserSettings.js')).default;
  if (await UserSettings.countDocuments() === 0 && ids[1]) {
    await UserSettings.insertMany([
      { userId: ids[1], theme: 'light', notifications: { email: true, push: true } },
      { userId: ids[3], theme: 'light', notifications: { email: true, push: false } }
    ]);
    console.log('✓ Seeded: usersettings');
  }

  // Seed Payroll if empty
  const Payroll = (await import('./models/Payroll.js')).default;
  if (await Payroll.countDocuments() === 0 && ids[3]) {
    await Payroll.insertMany([
      { employeeId: ids[3], employeeName: 'Mike Employee', month: 1, year: 2024, baseSalary: 3000, netSalary: 2800, status: 'paid' },
      { employeeId: ids[4], employeeName: 'Jane Developer', month: 1, year: 2024, baseSalary: 4500, netSalary: 4200, status: 'draft' }

    ]);
    console.log('✓ Seeded: payroll');
  }

  // Seed Tickets if empty
  const Ticket = (await import('./models/Ticket.js')).default;
  if (await Ticket.countDocuments() === 0 && ids[3]) {
    await Ticket.insertMany([
      { employeeId: ids[3], employeeName: 'Mike Employee', subject: 'Email Issue', description: 'Cannot access outlook', priority: 'high', status: 'open' },
      { employeeId: ids[3], employeeName: 'Mike Employee', subject: 'Keyboard Replacement', description: 'Keys are sticky', priority: 'low', status: 'closed' }
    ]);
    console.log('✓ Seeded: tickets');
  }

  console.log('✓ Full Database Connectivity Check & Seeding Complete.');
};

// Seed users collection for login (admin, hr, employees) with password
const seedUsers = async () => {
  const demoUsers = [
    { name: 'John Admin', email: 'admin@company.com', role: 'admin', status: 'active', employeeId: 'EMP001', department: 'IT', password: 'admin123' },
    { name: 'Sarah HR', email: 'hr@company.com', role: 'hr', status: 'active', employeeId: 'EMP002', department: 'Human Resources', password: 'hr123' },
    { name: 'Mike Employee', email: 'mike@company.com', role: 'employee', status: 'active', employeeId: 'EMP003', department: 'Sales', password: 'employee123' },
    { name: 'Jane Developer', email: 'jane@company.com', role: 'employee', status: 'active', employeeId: 'EMP004', department: 'IT', password: 'employee123' },
  ];

  for (const userData of demoUsers) {
    const existing = await User.findOne({ email: userData.email });
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const { password, ...rest } = userData;

    if (existing) {
      await User.findOneAndUpdate(
        { email: userData.email },
        { $set: { ...rest, password: hashedPassword } },
        { new: true }
      );
    } else {
      await User.create({ ...rest, password: hashedPassword });
    }
  }
  console.log('✓ Seeded users (admin, hr, employees) with hashed passwords');
};

// Global error handler
app.use((err, req, res, next) => {
  console.error('\n!!! GLOBAL SERVER ERROR !!!');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('Body:', req.body);
  console.error('!!! END GLOBAL ERROR !!!\n');
  
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: err.message,
    path: req.path
  });
});

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    await seedUsers();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
