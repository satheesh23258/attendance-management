import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

const router = express.Router();
const JWT_SECRET = process.env.VITE_JWT_SECRET || process.env.JWT_SECRET || 'demo-secret-key';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, employeeId, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const empId = employeeId || `EMP${Date.now().toString().slice(-5)}`;
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'employee',
      status: 'active',
      department: department || '',
      employeeId: empId,
      phone: phone || '',
      branchName: req.body.branchName || '',
    });

    // Also add to employees collection for consistency
    await Employee.findOneAndUpdate(
      { email: user.email },
      {
        name,
        email: user.email,
        role: user.role,
        department: department || 'Operations',
        phone: phone || '',
        employeeId: empId,
        isActive: true,
        joinDate: new Date().toISOString().split('T')[0],
        branchName: req.body.branchName || '',
      },
      { upsert: true }
    );

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        ...userResponse,
      },
      message: 'Account created successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password: either hashed (bcrypt) or plain (legacy demo users)
    let passwordValid = false;
    if (user.password) {
      passwordValid = await bcrypt.compare(password, user.password);
    }

    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    res.json({
      token,
      user: {
        id: user._id.toString(),
        ...userResponse,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me - get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.__v;

    res.json({
      id: user._id.toString(),
      ...userResponse,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default router;
