import { Router, Request, Response } from 'express';
import Achievement from '../models/Achievement';
import mongoose from 'mongoose';

const router = Router();

// @route   GET /api/achievements
// @desc    Get user unlocked milestones
router.get('/', async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.query;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Returning mock achievements.');
      return res.json([
        {
          _id: 'ach-1',
          userId: userId || 'emp-1',
          title: 'Code Warrior',
          description: 'Complete 10 tasks in a single week.',
          unlockedAt: new Date().toISOString()
        },
        {
          _id: 'ach-2',
          userId: userId || 'emp-1',
          title: 'Level Up',
          description: 'Reach Level 5.',
          unlockedAt: new Date().toISOString()
        }
      ]);
    }
    const filter = userId ? { userId: String(userId) } : {};
    const achievements = await Achievement.find(filter).sort({ unlockedAt: -1 });
    return res.json(achievements);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve achievements log.' });
  }
});

export default router;
