import { Router, Request, Response } from 'express';
import User from '../models/User';

const router = Router();

// @route   GET /api/users
// @desc    Get all users list
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find({}).select('-passwordHash');
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve users directory.' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard rankings
router.get('/leaderboard', async (req: Request, res: Response): Promise<any> => {
  try {
    const leaderboard = await User.find({})
      .select('name email avatar role department xp level rank status')
      .sort({ xp: -1 })
      .limit(10);
    
    // Auto-calculate ranks on return
    const ranked = leaderboard.map((user, idx) => {
      const uObj = user.toObject();
      uObj.rank = idx + 1;
      return uObj;
    });

    return res.json(ranked);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to compile leaderboard standings.' });
  }
});

// @route   GET /api/users/:id
// @desc    Get profile for single user
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User record not found.' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve profile telemetry.' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile settings
router.put('/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { name, phone, avatar, location, status } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { name, phone, avatar, location, status } },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User record not found.' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile nodes.' });
  }
});

export default router;
