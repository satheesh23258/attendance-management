import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import TempOtp from '../models/TempOtp.js';
import { generateOtp, hashOtp, verifyOtpHash } from '../utils/otp.js';
import { sendSms, sendEmail } from '../utils/smsService.js';
import Notification from '../models/Notification.js';
import { auth } from '../middleware/auth.js';


const router = express.Router();
const getJwtSecret = () => process.env.VITE_JWT_SECRET || process.env.JWT_SECRET || 'demo-secret-key';

// Store for tracking OTP attempts per phone/email (in-memory; move to Redis in production)
const otpAttempts = new Map();

// Middleware to rate-limit OTP requests per phone/email
const otpRequestLimiter = (req, res, next) => {
  const { phone, email, identifier, type } = req.body;
  const reqPhone = phone || (type === 'phone' ? identifier : null);
  const reqEmail = email || (type === 'email' ? identifier : null);

  const id = reqPhone ? `phone:${reqPhone}` : reqEmail ? `email:${reqEmail.toLowerCase()}` : null;

  if (!id) {
    return res.status(400).json({ message: 'Phone or email required' });
  }

  const now = Date.now();
  const window = 60 * 60 * 1000; // 1 hour window
  const maxAttempts = 3; // Max 3 OTP requests per hour

  if (!otpAttempts.has(id)) {
    otpAttempts.set(id, []);
  }

  const attempts = otpAttempts.get(id).filter(time => now - time < window);

  if (attempts.length >= maxAttempts) {
    return res.status(429).json({
      message: `Too many OTP requests. Please try again after ${Math.ceil((attempts[0] + window - now) / 60000)} minutes.`
    });
  }

  attempts.push(now);
  otpAttempts.set(id, attempts);
  next();
};

// Middleware to rate-limit OTP verify attempts per phone/email
const otpVerifyLimiter = (req, res, next) => {
  const { phone, email, identifier } = req.body;

  // identifier could be passed directly from new registration flow
  const reqPhone = phone || (identifier && identifier.match(/^[0-9+ ]+$/) ? identifier : null);
  const reqEmail = email || (identifier && identifier.includes('@') ? identifier : null);

  const id = reqPhone ? `verify:${reqPhone.trim()}` : reqEmail ? `verify:${reqEmail.toLowerCase().trim()}` : null;

  if (!id) {
    return res.status(400).json({ message: 'Phone or email required for verification tracking' });
  }

  const now = Date.now();
  const window = 15 * 60 * 1000; // 15 minute window
  const maxAttempts = 5; // Max 5 verify attempts per 15 min

  if (!otpAttempts.has(id)) {
    otpAttempts.set(id, []);
  }

  const attempts = otpAttempts.get(id).filter(time => now - time < window);

  if (attempts.length >= maxAttempts) {
    return res.status(429).json({
      message: `Too many OTP verification attempts. Please try again after ${Math.ceil((attempts[0] + window - now) / 60000)} minutes.`
    });
  }

  attempts.push(now);
  otpAttempts.set(id, attempts);
  next();
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, employeeId, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Name, email, phone, and password are required' });
    }

    // Verify TempOtp is verified for Email and Phone
    const emailOtp = await TempOtp.findOne({ identifier: email.toLowerCase().trim(), purpose: 'verify_email', verified: true });
    if (!emailOtp) {
      return res.status(400).json({ message: 'Email must be verified to register.' });
    }

    // Phone verification is no longer required

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const empId = employeeId || `EMP${Date.now().toString().slice(-5)}`;

    // Admin and HR approval logic
    const requiresApproval = role === 'admin' || role === 'hr';
    const status = requiresApproval ? 'pending' : 'active';
    const isNewAdmin = role === 'admin';

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'employee',
      status: status,
      department: department || '',
      employeeId: empId,
      phone: phone || '',
      phoneVerified: false,
      branchName: req.body.branchName || '',
      branchLocation: req.body.branchLocation || '',
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
        isActive: status === 'active',
        joinDate: new Date().toISOString().split('T')[0],
        branchName: req.body.branchName || '',
        branchLocation: req.body.branchLocation || '',
      },
      { upsert: true }
    );

    // Notify Admins about the new registration
    await Notification.create({
      title: isNewAdmin ? 'New Admin Pending Approval' : 'New Employee Registered',
      message: `${name} (${email}) has just registered as a ${role}.`,
      type: 'user',
      targetRole: 'admin',
      importance: isNewAdmin ? 'high' : 'normal',
      actionUrl: '/admin/employees'
    });

    // If a new admin signed up, find active admins and send notification mock email
    if (isNewAdmin) {
      const activeAdmins = await User.find({ role: 'admin', status: 'active' });
      const adminEmails = activeAdmins.map(a => a.email).join(', ');
      if (adminEmails) {
        await sendEmail(
          adminEmails,
          'Action Required: New Admin Registration Pending Approval',
          `A new user (${name}, ${email}) has registered as an Admin. Please log in to approve their account.`
        );
      }
    }

    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    res.status(201).json({
      user: {
        id: user._id.toString(),
        ...userResponse,
      },
      message: 'Account created successfully.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/request-otp
router.post('/request-otp', otpRequestLimiter, async (req, res) => {
  try {
    const { phone, email, purpose } = req.body
    if (!purpose || !['verify_phone', 'reset_password'].includes(purpose)) {
      return res.status(400).json({ message: 'Invalid OTP purpose' })
    }

    let user = null
    if (phone) user = await User.findOne({ phone: phone.trim() })
    if (!user && email) user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const otp = generateOtp(6)
    const otpHashed = await hashOtp(otp)
    user.otpHash = otpHashed
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000)
    user.otpPurpose = purpose
    user.otpAttempts = 0
    await user.save()

    // Send via SMS or email depending on available info
    if (user.phone) await sendSms(user.phone, `Your OTP code is: ${otp}`)
    else if (user.email) await sendEmail(user.email, 'Your OTP code', `OTP: ${otp}`)

    res.json({ message: 'OTP sent' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
})

// POST /api/auth/send-verification-otp (For New User Signup)
router.post('/send-verification-otp', otpRequestLimiter, async (req, res) => {
  try {
    const { identifier, type } = req.body; // type: 'email' or 'phone'
    if (!identifier || !type) return res.status(400).json({ message: 'identifier and type required' });

    // If phone, ensure no user has it, or email ensuring no user has it
    if (type === 'phone') {
      const user = await User.findOne({ phone: identifier.trim() });
      if (user) return res.status(400).json({ message: 'Phone already registered' });
    } else {
      const user = await User.findOne({ email: identifier.toLowerCase().trim() });
      if (user) return res.status(400).json({ message: 'Email already registered' });
    }

    const purpose = type === 'phone' ? 'verify_phone' : 'verify_email';
    const otp = generateOtp(6);
    const otpHashed = await hashOtp(otp);

    await TempOtp.findOneAndUpdate(
      { identifier: type === 'phone' ? identifier.trim() : identifier.toLowerCase().trim() },
      {
        otpHash: otpHashed,
        expires: new Date(Date.now() + 10 * 60 * 1000),
        purpose,
        verified: false
      },
      { upsert: true, new: true }
    );

    if (type === 'phone') {
      await sendSms(identifier.trim(), `Your verification code is: ${otp}`);
    } else {
      const result = await sendEmail(identifier.toLowerCase().trim(), 'Your Verification Code', `Your OTP: ${otp}`);
      if (!result.ok) {
        throw new Error(result.error || 'Failed to send verification email');
      }
    }

    res.json({ message: 'Verification OTP sent' });
  } catch (err) {
    console.error('OTP Route Error:', err);
    res.status(500).json({ message: err.message || 'Failed to send OTP' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', otpVerifyLimiter, async (req, res) => {
  try {
    const { userId, otp, purpose, phone, email, identifier } = req.body;
    if (!otp) return res.status(400).json({ message: 'OTP is required' });
    // If identifier is passed (from new frontend signup workflow)
    if (identifier) {
      // Use original casing if it's a phone, otherwise use lower (consistent with generation)
      const searchId = purpose === 'verify_phone' ? identifier.trim() : identifier.toLowerCase().trim();
      
      const tempEntry = await TempOtp.findOne({
        identifier: searchId,
        purpose
      });
      if (!tempEntry) return res.status(404).json({ message: 'OTP not requested or expired' });
      if (new Date() > tempEntry.expires) return res.status(400).json({ message: 'OTP expired' });

      const ok = await verifyOtpHash(otp, tempEntry.otpHash);
      if (!ok) return res.status(400).json({ message: 'Invalid OTP' });

      tempEntry.verified = true;
      await tempEntry.save();
      return res.json({ message: 'Verified successfully' });
    }

    let user = null
    if (userId) user = await User.findById(userId)
    if (!user && phone) user = await User.findOne({ phone: phone.trim() })
    // allow lookup by email when OTP was sent to email
    if (!user && email) user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (!user.otpHash || !user.otpExpires) return res.status(400).json({ message: 'No OTP requested' })
    if (new Date() > user.otpExpires) return res.status(400).json({ message: 'OTP expired' })
    if (user.otpPurpose && purpose && user.otpPurpose !== purpose) return res.status(400).json({ message: 'OTP purpose mismatch' })

    const ok = await verifyOtpHash(otp, user.otpHash)
    if (!ok) {
      user.otpAttempts = (user.otpAttempts || 0) + 1
      await user.save()
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    // OTP valid
    if (purpose === 'verify_phone' || user.otpPurpose === 'verify_phone') {
      user.phoneVerified = true
      user.otpHash = undefined
      user.otpExpires = undefined
      user.otpPurpose = undefined
      user.otpAttempts = 0
      await user.save()
      return res.json({ message: 'Phone verified' })
    }

    if (purpose === 'reset_password' || user.otpPurpose === 'reset_password') {
      // Client should call reset-password with the same OTP or we can allow verify to return a short-lived token
      // For simplicity, return a short-lived token to allow password reset
      const resetToken = jwt.sign({ id: user._id, t: 'reset' }, getJwtSecret(), { expiresIn: '15m' })
      user.otpHash = undefined
      user.otpExpires = undefined
      user.otpPurpose = undefined
      user.otpAttempts = 0
      await user.save()
      return res.json({ message: 'OTP verified', resetToken })
    }

    res.json({ message: 'OTP verified' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to verify OTP' })
  }
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body
    if (!resetToken || !newPassword) return res.status(400).json({ message: 'resetToken and newPassword required' })
    let decoded = null
    try { decoded = jwt.verify(resetToken, getJwtSecret()) } catch (e) { return res.status(400).json({ message: 'Invalid or expired reset token' }) }

    if (!decoded?.id) return res.status(400).json({ message: 'Invalid reset token' })
    const user = await User.findById(decoded.id).select('+password')
    if (!user) return res.status(404).json({ message: 'User not found' })

    const hashed = await bcrypt.hash(newPassword, 10)
    user.password = hashed
    await user.save()
    res.json({ message: 'Password updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to reset password' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, requiredRole } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      // Return specific error if role was intended
      if (requiredRole) {
        return res.status(404).json({ message: `${requiredRole.toUpperCase()} account not found.` });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Role check if requiredRole is provided
    if (requiredRole) {
      const isPrimaryRole = user.role === requiredRole;
      const hasHybridRole = user.hybridPermissions && user.hybridPermissions.roles?.includes(requiredRole);

      if (!isPrimaryRole && !hasHybridRole) {
        return res.status(404).json({ message: `${requiredRole.toUpperCase()} account not found.` });
      }
    }

    // Check password: either hashed (bcrypt) or plain (legacy demo users)
    let passwordValid = false;
    if (user.password) {
      passwordValid = await bcrypt.compare(password, user.password);
    }

    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'pending') {
      return res.status(401).json({ message: 'Account is pending approval from an administrator.' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    const employee = await Employee.findOne({ email: user.email });

    res.json({
      token,
      user: {
        id: user._id.toString(),
        ...userResponse,
        employeeId: employee ? employee._id.toString() : null,
        employeeUid: employee ? employee.employeeId : null,
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
    const decoded = jwt.verify(token, getJwtSecret());

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.__v;

    const employee = await Employee.findOne({ email: user.email });

    res.json({
      id: user._id.toString(),
      ...userResponse,
      employeeId: employee ? employee._id.toString() : null,
      employeeUid: employee ? employee.employeeId : null,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// PUT /api/auth/profile - update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, department, branchName } = req.body;

    // Update User
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (department) user.department = department;
    if (branchName !== undefined) user.branchName = branchName;
    if (req.body.branchLocation !== undefined) user.branchLocation = req.body.branchLocation;

    await user.save();

    // Sync with Employee collection
    const employee = await Employee.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          name: user.name,
          phone: user.phone,
          department: user.department,
          branchName: user.branchName,
          branchLocation: user.branchLocation
        }
      },
      { new: true, runValidators: true }
    );

    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.password;

    res.json({
      ...userResponse,
      employeeDetails: employee
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
});

export default router;
