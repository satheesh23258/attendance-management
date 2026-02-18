import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Otp from '../models/Otp.js';
import { sendOtpEmail } from '../config/email.js';
import {
  registerValidation,
  loginValidation,
  otpValidation,
  sendOtpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = express.Router();
const JWT_SECRET = process.env.VITE_JWT_SECRET || process.env.JWT_SECRET || 'demo-secret-key';

// POST /api/auth/register
// Step 1: Create unverified user account and send OTP
router.post('/register', registerValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password, role, department, employeeId, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const empId = employeeId || `EMP${Date.now().toString().slice(-5)}`;
    
    // Create user but mark as unverified
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'employee',
      status: 'active',
      isVerified: false, // Not verified until OTP is confirmed
      department: department || '',
      employeeId: empId,
      phone: phone || '',
      branchName: req.body.branchName || '',
    });

    // Send OTP to email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    await Otp.create({
      email: user.email,
      code: otp,
      used: false,
      expiresAt: otpExpiry,
    });

    const emailResult = await sendOtpEmail(user.email, otp);
    
    if (!emailResult.success && process.env.NODE_ENV === 'production') {
      // In production, if email fails, delete the user and return error
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
    }

    res.status(201).json({
      message: 'Account created. Please verify your email with the OTP sent to your inbox.',
      email: user.email,
      userId: user._id.toString(),
      requiresVerification: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
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

// POST /api/auth/forgot-password
// Request OTP for password reset
router.post('/forgot-password', forgotPasswordValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;
    const normalized = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalized });
    if (!user) {
      // Don't reveal if user exists - for security
      return res.json({
        message: 'If the email exists, an OTP will be sent to reset your password',
        email: normalized,
      });
    }

    // Rate limit: prevent spamming
    const recent = await Otp.findOne({ email: normalized, used: false }).sort({ createdAt: -1 });
    if (recent && recent.expiresAt > new Date() && (Date.now() - new Date(recent.createdAt).getTime()) < 60000) {
      return res.status(429).json({ message: 'OTP recently sent. Please wait a moment before requesting another.' });
    }

    // Generate OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await Otp.create({
      email: normalized,
      code,
      expiresAt,
      used: false,
    });

    // Send OTP email
    const emailResult = await sendOtpEmail(normalized, code);

    if (!emailResult.success) {
      console.error('Failed to send forgot password OTP:', emailResult.error);
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
      }
    }

    return res.json({
      message: 'If the email exists, an OTP will be sent to reset your password',
      email: normalized,
      expiresIn: 300, // 5 minutes
    });
  } catch (error) {
    console.error('forgot-password error:', error);
    return res.status(500).json({ message: 'Failed to process forgot password request' });
  }
});

// POST /api/auth/reset-password
// Verify OTP and reset password
router.post('/reset-password', resetPasswordValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const normalized = email.toLowerCase().trim();

    // Find valid OTP
    const otpRecord = await Otp.findOne({
      email: normalized,
      code: code.toString(),
      used: false,
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired' });
    }

    // Find user
    const user = await User.findOne({ email: normalized });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    return res.json({
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('reset-password error:', error);
    return res.status(500).json({ message: 'Failed to reset password' });
  }
});

// POST /api/auth/send-otp { email }
router.post('/send-otp', sendOtpValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const normalized = email.toLowerCase().trim();

    // Rate limit: prevent spamming
    const recent = await Otp.findOne({ email: normalized, used: false }).sort({ createdAt: -1 });
    if (recent && recent.expiresAt > new Date() && (Date.now() - new Date(recent.createdAt).getTime()) < 60000) {
      return res.status(429).json({ message: 'OTP recently sent. Please wait a moment before requesting another.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await Otp.create({ email: normalized, code, expiresAt });

    const emailResult = await sendOtpEmail(normalized, code);

    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
      }
    }

    return res.json({ 
      message: 'OTP sent to email',
      email: normalized,
      expiresIn: 300, // 5 minutes in seconds
    });
  } catch (err) {
    console.error('send-otp error:', err);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// POST /api/auth/verify-otp
// Step 2: Verify OTP and mark user as verified
router.post('/verify-otp', otpValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const normalized = email.toLowerCase().trim();
    
    // Find valid OTP
    const otpRecord = await Otp.findOne({ 
      email: normalized, 
      code: code.toString(), 
      used: false 
    });
    
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }
    
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP code has expired' });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Mark user as verified
    const user = await User.findOne({ email: normalized });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    user.isVerified = true;
    await user.save();

    // Also add/update employee record
    await Employee.findOneAndUpdate(
      { email: user.email },
      {
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || 'Operations',
        phone: user.phone || '',
        employeeId: user.employeeId,
        isActive: true,
        joinDate: new Date().toISOString().split('T')[0],
        branchName: user.branchName || '',
      },
      { upsert: true }
    );

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.password;

    return res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id.toString(),
        ...userResponse,
      },
    });
  } catch (err) {
    console.error('verify-otp error:', err);
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
});
