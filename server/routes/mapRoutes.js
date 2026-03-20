import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import LiveLocation from '../models/LiveLocation.js';
import LocationHistory from '../models/LocationHistory.js';

const router = express.Router();

// POST /api/live-location/update
// Frontend sends every 5 seconds
router.post('/live-location/update', auth, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (lat == null || lng == null) {
      return res.status(400).json({ message: 'Latitude and Longitude required' });
    }

    const userId = req.user._id;

    // 1. Update LiveLocation
    await LiveLocation.findOneAndUpdate(
      { userId },
      { lat, lng },
      { upsert: true, new: true }
    );

    // 2. Add to LocationHistory
    await LocationHistory.create({ userId, lat, lng });

    // 3. Limit history to latest 200 points to keep MongoDB fast and clean
    const count = await LocationHistory.countDocuments({ userId });
    if (count > 200) {
      // Find oldest records to delete
      const staleRecords = await LocationHistory.find({ userId })
        .sort({ timestamp: 1 }) // oldest first
        .limit(count - 200)
        .select('_id');
      
      const staleIds = staleRecords.map(r => r._id);
      await LocationHistory.deleteMany({ _id: { $in: staleIds } });
    }

    res.status(200).json({ message: 'Location updated' });
  } catch (error) {
    console.error('Update Live Location error:', error);
    res.status(500).json({ message: 'Failed to update location' });
  }
});

// GET /api/map/locations
// Returns current live locations based on JWT role visibility rules
router.get('/map/locations', auth, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    // First figure out whose locations this user is allowed to see
    let allowedUsersQuery = {};

    if (userRole === 'employee') {
      // Employee sees their own location and other employees
      allowedUsersQuery = { role: 'employee' };
    } else if (userRole === 'hr') {
      // HR sees employees and other HRs
      allowedUsersQuery = { role: { $in: ['employee', 'hr'] } };
    } else if (userRole === 'admin') {
      // Admin sees everyone
      allowedUsersQuery = {}; 
    }

    // Get the User IDs we are allowed to see
    const visibleUsers = await User.find(allowedUsersQuery).select('_id name role');
    const visibleUserIds = visibleUsers.map(u => u._id);

    // Get their live locations (only recent ones within last 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const locations = await LiveLocation.find({
      userId: { $in: visibleUserIds },
      updatedAt: { $gte: oneHourAgo }
    }).populate('userId', 'name role');

    // Format output
    const formatted = locations.map(loc => {
      // populate safety check if user was deleted
      const u = loc.userId || { name: 'Unknown', role: 'employee' };
      return {
        userId: u._id || loc.userId,
        name: u.name,
        role: u.role,
        lat: loc.lat,
        lng: loc.lng,
        lastUpdated: loc.updatedAt
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Get Map Locations error:', error);
    res.status(500).json({ message: 'Failed to fetch map locations' });
  }
});

// GET /api/map/location-history/:targetUserId
// Returns location history forming a line path
router.get('/map/location-history/:targetUserId', auth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userRole = req.user.role;

    // Security check: HR can see Employee/HR paths, Admin sees all, Employee sees only theirs
    if (userRole === 'employee' && targetUserId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only view your own path' });
    }
    
    if (userRole === 'hr') {
      const targetUser = await User.findById(targetUserId);
      if (targetUser && targetUser.role === 'admin') {
        return res.status(403).json({ message: 'Forbidden: Cannot view admin paths' });
      }
    }

    // Return the latest 100 points sorted chronologically
    const history = await LocationHistory.find({ userId: targetUserId })
      .sort({ timestamp: -1 }) // get latest first
      .limit(100);

    // Reverse to chronological order for line drawing
    const path = history.reverse().map(h => ({
      lat: h.lat,
      lng: h.lng,
      timestamp: h.timestamp
    }));

    res.status(200).json(path);
  } catch (error) {
    console.error('Get Location History error:', error);
    res.status(500).json({ message: 'Failed to fetch location history' });
  }
});

export default router;
