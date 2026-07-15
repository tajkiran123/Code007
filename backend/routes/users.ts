import { Router, Request, Response } from 'express';
import User from '../models/User';
import mongoose from 'mongoose';

const router = Router();

const MOCK_USERS = [
  {
    id: 'emp-1',
    _id: 'emp-1',
    name: 'Developer Engineer 01',
    role: 'Employee',
    email: 'employee1@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    xp: 3420,
    level: 4,
    streak: 6,
    badges: ['badge-1', 'badge-2', 'badge-4'],
    department: 'Engineering',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    employeeId: 'EMP-001',
    location: 'Austin, TX',
    status: 'active',
    burnoutScore: 25,
    completedTasksCount: 12,
    pendingTasksCount: 2,
    commitsCount: 45,
    salary: '$115,000'
  },
  {
    id: 'mgr-1',
    _id: 'mgr-1',
    name: 'Manager Leader 01',
    role: 'Manager',
    email: 'manager01@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80',
    xp: 8520,
    level: 7,
    streak: 12,
    badges: ['badge-3', 'badge-7', 'badge-10'],
    department: 'Product',
    joinedAt: '2025-05-10',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    employeeId: 'MGR-001',
    location: 'New York, NY',
    status: 'active',
    burnoutScore: 12,
    completedTasksCount: 30,
    pendingTasksCount: 2,
    commitsCount: 120,
    salary: '$145,000'
  },
  {
    id: 'adm-1',
    _id: 'adm-1',
    name: 'Admin Commander 01',
    role: 'Admin',
    email: 'admin01@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    xp: 5000,
    level: 5,
    streak: 8,
    badges: ['badge-5'],
    department: 'DevOps',
    joinedAt: '2025-01-01',
    themeColor: 'purple',
    skipsLeft: 2,
    streakFreezeActive: false,
    employeeId: 'ADM-001',
    location: 'San Francisco, CA',
    status: 'active',
    burnoutScore: 5,
    completedTasksCount: 42,
    pendingTasksCount: 0,
    commitsCount: 154,
    salary: '$160,000'
  }
];

// @route   GET /api/users
// @desc    Get all users list
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Returning mock users.');
      return res.json(MOCK_USERS);
    }
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
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Returning mock leaderboard.');
      const ranked = [...MOCK_USERS]
        .sort((a, b) => b.xp - a.xp)
        .map((u, idx) => ({ ...u, rank: idx + 1 }));
      return res.json(ranked);
    }
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
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Returning mock profile.');
      const user = MOCK_USERS.find(u => u.id === id || u.employeeId === id) || MOCK_USERS[0];
      return res.json(user);
    }
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
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Simulating profile update.');
      const user = MOCK_USERS.find(u => u.id === id || u.employeeId === id) || MOCK_USERS[0];
      const updatedUser = { ...user, name, phone, avatar, location, status };
      return res.json(updatedUser);
    }
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

// @route   PUT /api/users/:id/preferences
// @desc    Update user custom preferences (e.g. themeColor)
router.put('/:id/preferences', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { themeColor, avatar } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Simulating preferences update.');
      const user = MOCK_USERS.find(u => u.id === id || u.employeeId === id) || MOCK_USERS[0];
      const updatedUser = { ...user, themeColor: themeColor || user.themeColor, avatar: avatar || user.avatar };
      return res.json(updatedUser);
    }
    const updateObj: any = {};
    if (themeColor) updateObj.themeColor = themeColor;
    if (avatar) updateObj.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User record not found.' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update user preferences.' });
  }
});

// @route   POST /api/users/:id/streak-freeze
// @desc    Buy or activate streak freeze
router.post('/:id/streak-freeze', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { action } = req.body; // 'buy' or 'activate'

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Simulating streak freeze action.');
      const user = MOCK_USERS.find(u => u.id === id || u.employeeId === id) || MOCK_USERS[0];
      if (action === 'buy') {
        if (user.xp < 500) {
          return res.status(400).json({ error: 'Insufficient XP. Needs 500 XP to purchase.' });
        }
        user.xp -= 500;
        user.skipsLeft += 1;
        return res.json({ message: 'Streak freeze skip purchased.', user });
      } else if (action === 'activate') {
        if (user.skipsLeft <= 0) {
          return res.status(400).json({ error: 'No streak freeze skips available. Purchase one first.' });
        }
        if (user.streakFreezeActive) {
          return res.status(400).json({ error: 'Streak freeze is already active.' });
        }
        user.skipsLeft -= 1;
        user.streakFreezeActive = true;
        return res.json({ message: 'Streak freeze activated.', user });
      } else {
        return res.status(400).json({ error: 'Invalid action. Must be "buy" or "activate".' });
      }
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    if (action === 'buy') {
      if (user.xp < 500) {
        return res.status(400).json({ error: 'Insufficient XP. Needs 500 XP to purchase.' });
      }
      user.xp -= 500;
      user.skipsLeft += 1;
      await user.save();
      return res.json({ message: 'Streak freeze skip purchased.', user });
    } else if (action === 'activate') {
      if (user.skipsLeft <= 0) {
        return res.status(400).json({ error: 'No streak freeze skips available. Purchase one first.' });
      }
      if (user.streakFreezeActive) {
        return res.status(400).json({ error: 'Streak freeze is already active.' });
      }
      user.skipsLeft -= 1;
      user.streakFreezeActive = true;
      await user.save();
      return res.json({ message: 'Streak freeze activated.', user });
    } else {
      return res.status(400).json({ error: 'Invalid action. Must be "buy" or "activate".' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process streak freeze request.' });
  }
});

export default router;
