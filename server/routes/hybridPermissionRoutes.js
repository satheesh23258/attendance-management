import express from 'express';
import jwt from 'jsonwebtoken';
import HybridPermission from '../models/HybridPermission.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

// Apply auth middleware to all routes below
router.use(auth);


// Grant hybrid permission to employee (Admin only)
router.post('/grant', adminOnly, async (req, res) => {
  try {
    const { employeeId, permissions, notes } = req.body;

    // Validate employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Get admin info - handle case where admin might not be in Employee table
    const adminUser = await User.findById(req.user.id);
    const adminEmployee = await Employee.findOne({ email: adminUser.email });

    const granterId = adminEmployee ? adminEmployee._id : adminUser._id;
    const granterName = adminEmployee ? adminEmployee.name : adminUser.name;

    // Check if employee already has active hybrid permission
    let hybridPermission = await HybridPermission.findOne({ employeeId, status: 'active' });
    
    if (hybridPermission) {
      // Update existing
      hybridPermission.permissions = {
        canAccessHR: permissions?.canAccessHR ?? false,
        canAccessEmployee: permissions?.canAccessEmployee ?? true,
        canViewReports: permissions?.canViewReports ?? false,
        canManageAttendance: permissions?.canManageAttendance ?? true,
        canManageLeaves: permissions?.canManageLeaves ?? false,
        ...permissions
      };
      hybridPermission.notes = notes || hybridPermission.notes;
      hybridPermission.grantedBy = granterId;
      hybridPermission.grantedByName = granterName;
      await hybridPermission.save();
    } else {
      // Create new hybrid permission
      hybridPermission = new HybridPermission({
        employeeId,
        employeeName: employee.name,
        employeeEmail: employee.email,
        grantedBy: granterId,
        grantedByName: granterName,
        permissions: {
          canAccessHR: permissions?.canAccessHR ?? false,
          canAccessEmployee: permissions?.canAccessEmployee ?? true,
          canViewReports: permissions?.canViewReports ?? false,
          canManageAttendance: permissions?.canManageAttendance ?? true,
          canManageLeaves: permissions?.canManageLeaves ?? false,
          ...permissions
        },
        notes
      });
      await hybridPermission.save();
    }

    // Sync with User model for session management
    await User.findOneAndUpdate(
      { email: employee.email },
      { 
        $set: { 
          'hybridPermissions.hasAccess': true,
          'hybridPermissions.roles': ['employee', 'hr'],
          'hybridPermissions.permissions': hybridPermission.permissions,
          'hybridPermissions.granterId': granterId
        } 
      }
    );

    // Sync with Employee model for UI display in lists
    await Employee.findByIdAndUpdate(
      employeeId,
      {
        $set: {
          hybridPermissions: {
            hasAccess: true,
            permissions: hybridPermission.permissions
          }
        }
      }
    );

    res.status(201).json({
      message: 'Hybrid permission granted successfully',
      permission: hybridPermission
    });
  } catch (error) {
    console.error('Error granting hybrid permission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Revoke hybrid permission (Admin only)
router.patch('/revoke/:permissionId', adminOnly, async (req, res) => {
  try {
    const { permissionId } = req.params;

    const permission = await HybridPermission.findById(permissionId);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    permission.status = 'revoked';
    await permission.save();

    // Sync with User model
    await User.findOneAndUpdate(
      { email: permission.employeeEmail },
      { 
        $set: { 
          'hybridPermissions.hasAccess': false,
          'hybridPermissions.roles': [],
          'hybridPermissions.permissions': {}
        } 
      }
    );

    // Sync with Employee model
    await Employee.findOneAndUpdate(
      { email: permission.employeeEmail },
      {
        $set: {
          'hybridPermissions.hasAccess': false,
          'hybridPermissions.permissions': {}
        }
      }
    );

    res.json({ message: 'Hybrid permission revoked successfully' });
  } catch (error) {
    console.error('Error revoking hybrid permission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all hybrid permissions (Admin only)
router.get('/all', adminOnly, async (req, res) => {
  try {
    const permissions = await HybridPermission.find()
      .populate('employeeId', 'name email employeeId department')
      .populate('grantedBy', 'name email employeeId')
      .sort({ createdAt: -1 });

    res.json(permissions);
  } catch (error) {
    console.error('Error fetching hybrid permissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if user has hybrid permission
router.get('/check/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const permission = await HybridPermission.findActiveByEmployee(employeeId);
    
    if (!permission) {
      return res.json({ hasHybridPermission: false });
    }

    // Update access tracking
    await permission.updateAccess();

    res.json({
      hasHybridPermission: true,
      permission: {
        permissions: permission.permissions,
        expiresAt: permission.expiresAt,
        grantedBy: permission.grantedByName
      }
    });
  } catch (error) {
    console.error('Error checking hybrid permission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employees eligible for hybrid permission (Admin only)
router.get('/eligible-employees', adminOnly, async (req, res) => {
  try {
    const employees = await Employee.find({ 
      role: 'employee',
      isActive: true 
    }).select('name email employeeId department');

    // Get employees who already have hybrid permissions
    const existingPermissions = await HybridPermission.find({
      status: 'active',
      expiresAt: { $gt: new Date() }
    }).select('employeeId');

    const employeeIdsWithPermissions = existingPermissions.map(p => p.employeeId);

    // Filter out employees who already have permissions
    const eligibleEmployees = employees.filter(
      emp => !employeeIdsWithPermissions.includes(emp._id)
    );

    res.json(eligibleEmployees);
  } catch (error) {
    console.error('Error fetching eligible employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee's hybrid permission details
router.get('/my-permission', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const employee = await Employee.findOne({ email: user.email });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const permission = await HybridPermission.findActiveByEmployee(employee._id);
    
    if (!permission) {
      return res.json({ hasHybridPermission: false });
    }

    res.json({
      hasHybridPermission: true,
      permission: {
        permissions: permission.permissions,
        expiresAt: permission.expiresAt,
        grantedBy: permission.grantedByName,
        grantedAt: permission.grantedAt,
        accessCount: permission.accessCount,
        lastAccessed: permission.lastAccessed
      }
    });
  } catch (error) {
    console.error('Error fetching hybrid permission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
