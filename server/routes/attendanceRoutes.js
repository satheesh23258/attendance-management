import express from 'express';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';
import HybridPermission from '../models/HybridPermission.js';
import Location from '../models/Location.js';
import { auth, requireRole } from '../middleware/auth.js';


const router = express.Router();

// utility: Haversine distance in meters
const distanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 🗺️ Feature 3: Advanced Geo-Fencing Check-in
router.post('/check-in', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

    const { lat, lng } = req.body;
    const now = new Date();
    const date = now.toISOString().split('T')[0];

    // Check if remote or within geofence
    if (!employee.isRemote) {
        if (!lat || !lng) return res.status(400).json({ message: 'GPS location required for office check-in' });
        
        const dist = distanceInMeters(
            employee.officeLocation.lat,
            employee.officeLocation.lng,
            lat,
            lng
        );

        if (dist > employee.officeLocation.radius) {
            return res.status(403).json({ 
                message: `Out of bounds. You are ${Math.round(dist)}m away from office. Limit is ${employee.officeLocation.radius}m.` 
            });
        }
    }

    const checkInTime = now.toTimeString().slice(0, 8);
    let status = now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() === 0) ? 'present' : 'late';

    let record = await Attendance.findOne({ employeeId: employee._id, date });
    
    if (record) {
      record.history.push({ action: 'check-in', time: checkInTime, timestamp: now });
      record.location = { lat, lng, address: employee.isRemote ? 'Remote' : 'Office' };
      // Do not overwrite initial check-in time if it exists
      if (!record.checkIn) record.checkIn = checkInTime;
      record.status = record.status || status;
      await record.save();
    } else {
      record = await Attendance.create({
        employeeId: employee._id,
        employeeName: employee.name,
        date,
        checkIn: checkInTime,
        status,
        location: { lat, lng, address: employee.isRemote ? 'Remote' : 'Office' },
        markedBy: req.user._id,
        markedByName: req.user.name,
        history: [{ action: 'check-in', time: checkInTime, timestamp: now }]
      });
    }

    // Sync Live Location
    await Location.findOneAndUpdate(
      { employeeId: employee._id },
      {
        employeeId: employee._id,
        employeeName: employee.name,
        latitude: lat,
        longitude: lng,
        address: employee.isRemote ? 'Remote' : 'Office',
        isActive: true
      },
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🛂 Feature: HR/Admin/Hybrid Manual Marking
router.post('/mark', auth, async (req, res) => {

  try {
    let { employeeId, status, date, checkIn, checkOut, location } = req.body;
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }

    // 1. Permission Check
    let hasPermission = req.user.role === 'admin' || req.user.role === 'hr';
    
    if (!hasPermission) {
        // Check for hybrid permission
        const employeeProfile = await Employee.findOne({ email: req.user.email });
        if (employeeProfile) {
            const hybrid = await HybridPermission.findOne({ 
                employeeId: employeeProfile._id, 
                status: 'active',
                'permissions.canManageAttendance': true 
            });
            if (hybrid) hasPermission = true;
        }
    }

    if (!hasPermission) {
        return res.status(403).json({ message: 'Permission denied: Cannot mark attendance for others' });
    }

    // 2. Find target employee
    const targetEmployee = await Employee.findById(employeeId);
    if (!targetEmployee) return res.status(404).json({ message: 'Target employee not found' });

    let defaultCheckIn = '';
    if (status === 'present' || status === 'late') {
        const now = new Date();
        // Shift time by IST if necessary or just use server time
        defaultCheckIn = now.toTimeString().slice(0, 8);
    }

    // 3. Create/Update attendance
    const record = await Attendance.findOneAndUpdate(
      { employeeId, date },
      {
        employeeId,
        employeeName: targetEmployee.name,
        date,
        checkIn: checkIn || defaultCheckIn,
        checkOut: checkOut || '',
        status: status || 'present',
        location: location || { address: 'Manual Entry' },
        markedBy: req.user._id,
        markedByName: req.user.name,
      },
      { upsert: true, new: true }
    );

    // Sync Live Location map so they show up for admins
    if (status === 'present' || status === 'late') {
      await Location.findOneAndUpdate(
        { employeeId },
        {
          employeeId,
          employeeName: targetEmployee.name,
          latitude: targetEmployee.officeLocation?.lat || targetEmployee.location?.lat || 11.1085,
          longitude: targetEmployee.officeLocation?.lng || targetEmployee.location?.lng || 77.3411,
          address: targetEmployee.branchLocation || 'Office',
          isActive: true
        },
        { upsert: true, new: true }
      );
    } else {
      await Location.findOneAndUpdate(
        { employeeId },
        { isActive: false }
      );
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Original Routes Rest (simplified for space)

router.post('/check-out', auth, async (req, res) => {
    try {
      const employee = await Employee.findOne({ email: req.user.email });
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const record = await Attendance.findOne({ employeeId: employee._id, date });
      if (!record) return res.status(400).json({ message: 'Check-in first' });
      record.checkOut = now.toTimeString().slice(0, 8);
      if (!record.history) record.history = [];
      record.history.push({ action: 'check-out', time: record.checkOut, timestamp: now });
      await record.save();

      // Sync Live Location - Mark as Inactive
      await Location.findOneAndUpdate(
        { employeeId: employee._id },
        { isActive: false }
      );

      res.json(record);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/history', auth, async (req, res) => {
  try {
    const filter = req.query.employeeId ? { employeeId: req.query.employeeId } : {};
    const attendance = await Attendance.find(filter).sort({ date: -1 });
    res.json(attendance);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/today', auth, async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendance = await Attendance.find({ date: today });
      res.json(attendance);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/my-today', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });
    
    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.findOne({ employeeId: employee._id, date: today });
    res.json(attendance);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/my-history', auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    
    const attendance = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
});

export default router;
