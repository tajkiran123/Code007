import { Router, Request, Response } from 'express';
import Achievement from '../models/Achievement';

const router = Router();

// @route   GET /api/achievements
// @desc    Get user unlocked milestones
router.get('/', async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.query;

  try {
    const filter = userId ? { userId: String(userId) } : {};
    const achievements = await Achievement.find(filter).sort({ unlockedAt: -1 });
    return res.json(achievements);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve achievements log.' });
  }
});

export default router;
