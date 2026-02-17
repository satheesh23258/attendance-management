import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET all notifications (supports ?userId=<employeeId>&unreadOnly=true&limit=n)
router.get('/', async (req, res) => {
  try {
    const { userId, unreadOnly, limit } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (unreadOnly === 'true') filter.isRead = false;

    let query = Notification.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(Number(limit));
    const notifications = await query.exec();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET unread count (supports ?userId=<employeeId>)
router.get('/unread-count', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = { isRead: false };
    if (userId) filter.userId = userId;
    const count = await Notification.countDocuments(filter);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH mark all as read
router.patch('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({}, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
