import { Router, Request, Response } from 'express';
import Notification from '../models/Notification';
import mongoose from 'mongoose';

const router = Router();

// @route   GET /api/notifications
// @desc    Get user notifications
router.get('/', async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.query;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Returning mock notifications.');
      return res.json([
        {
          _id: 'notif-1',
          userId: userId || 'emp-1',
          text: 'Welcome to WorkQuest AI! Start completing tasks to earn XP.',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'notif-2',
          userId: userId || 'emp-1',
          text: 'New task assigned: Optimize WebGL Shader Nodes',
          read: false,
          createdAt: new Date().toISOString()
        }
      ]);
    }
    const filter = userId ? { userId: String(userId) } : {};
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(30);
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve notification logs.' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a single log as read
router.put('/:id/read', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Simulating marking notification as read.');
      return res.json({ _id: id, read: true });
    }
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { read: true } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification record not found.' });
    }
    return res.json(notification);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update notification state.' });
  }
});

export default router;
