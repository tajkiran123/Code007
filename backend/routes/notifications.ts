import { Router, Request, Response } from 'express';
import Notification from '../models/Notification';

const router = Router();

// @route   GET /api/notifications
// @desc    Get user notifications
router.get('/', async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.query;

  try {
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
