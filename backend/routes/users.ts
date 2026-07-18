import { Router, Request, Response } from 'express';
import User from '../models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const router = Router();

const MOCK_USERS = [
  // Sarah Johnson's employees
  {
    id: 'EMP001',
    _id: 'EMP001',
    employeeId: 'EMP001',
    name: 'Alex Carter',
    role: 'Employee',
    email: 'employee1@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    xp: 3420,
    level: 4,
    streak: 6,
    badges: ['badge-1', 'badge-2', 'badge-4'],
    department: 'Engineering',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$115,000',
    location: 'Austin, TX',
    phone: '+1555200001',
    burnoutScore: 15,
    completedTasksCount: 18,
    pendingTasksCount: 1,
    commitsCount: 95,
    status: 'active',
    managerId: 'MGR001'
  },
  // Manager 1
  {
    id: 'MGR001',
    _id: 'MGR001',
    employeeId: 'MGR001',
    name: 'Sarah Johnson',
    role: 'Manager',
    email: 'manager01@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    xp: 4000,
    level: 4,
    streak: 12,
    badges: ['badge-3', 'badge-7'],
    department: 'Engineering',
    joinedAt: '2025-05-10',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$145,000',
    location: 'New York, NY',
    phone: '+1555100001',
    burnoutScore: 12,
    completedTasksCount: 30,
    pendingTasksCount: 2,
    commitsCount: 120,
    status: 'active',
    managerId: 'CEO001'
  },
  // CEO
  {
    id: 'CEO001',
    _id: 'CEO001',
    employeeId: 'CEO001',
    name: 'John Anderson',
    role: 'Admin',
    email: 'admin01@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    xp: 5000,
    level: 5,
    streak: 8,
    badges: ['badge-5', 'badge-8'],
    department: 'Executive',
    joinedAt: '2024-03-12',
    themeColor: 'purple',
    skipsLeft: 2,
    streakFreezeActive: false,
    salary: '$180,000',
    location: 'San Francisco, CA',
    phone: '+1555000001',
    burnoutScore: 5,
    completedTasksCount: 42,
    pendingTasksCount: 0,
    commitsCount: 154,
    status: 'active',
    managerId: undefined
  },
  // Manager 2
  {
    id: 'MGR002',
    _id: 'MGR002',
    employeeId: 'MGR002',
    name: 'Michael Lee',
    role: 'Manager',
    email: 'manager02@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    xp: 4000,
    level: 4,
    streak: 12,
    badges: ['badge-3', 'badge-7'],
    department: 'Marketing',
    joinedAt: '2025-05-10',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$140,000',
    location: 'New York, NY',
    phone: '+1555100002',
    burnoutScore: 12,
    completedTasksCount: 30,
    pendingTasksCount: 2,
    commitsCount: 120,
    status: 'active',
    managerId: 'CEO001'
  },
  // Sarah Johnson's other employees
  {
    id: 'EMP002',
    _id: 'EMP002',
    employeeId: 'EMP002',
    name: 'Emma Wilson',
    role: 'Employee',
    email: 'employee2@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    xp: 1900,
    level: 2,
    streak: 5,
    badges: ['badge-1'],
    department: 'Engineering',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$110,000',
    location: 'Remote',
    phone: '+1555200002',
    burnoutScore: 45,
    completedTasksCount: 12,
    pendingTasksCount: 2,
    commitsCount: 65,
    status: 'active',
    managerId: 'MGR001'
  },
  {
    id: 'EMP003',
    _id: 'EMP003',
    employeeId: 'EMP003',
    name: 'Daniel Brown',
    role: 'Employee',
    email: 'employee3@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    xp: 3200,
    level: 4,
    streak: 7,
    badges: ['badge-2'],
    department: 'Engineering',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$115,000',
    location: 'Austin, TX',
    phone: '+1555200003',
    burnoutScore: 20,
    completedTasksCount: 22,
    pendingTasksCount: 0,
    commitsCount: 110,
    status: 'active',
    managerId: 'MGR001'
  },
  {
    id: 'EMP004',
    _id: 'EMP004',
    employeeId: 'EMP004',
    name: 'Olivia Davis',
    role: 'Employee',
    email: 'employee4@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    xp: 2200,
    level: 3,
    streak: 4,
    badges: [],
    department: 'Engineering',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$112,000',
    location: 'Austin, TX',
    phone: '+1555200004',
    burnoutScore: 28,
    completedTasksCount: 15,
    pendingTasksCount: 1,
    commitsCount: 78,
    status: 'active',
    managerId: 'MGR001'
  },
  {
    id: 'EMP005',
    _id: 'EMP005',
    employeeId: 'EMP005',
    name: 'Noah Miller',
    role: 'Employee',
    email: 'employee5@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
    xp: 2800,
    level: 3,
    streak: 6,
    badges: ['badge-1'],
    department: 'Engineering',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$115,000',
    location: 'Remote',
    phone: '+1555200005',
    burnoutScore: 18,
    completedTasksCount: 20,
    pendingTasksCount: 0,
    commitsCount: 92,
    status: 'active',
    managerId: 'MGR001'
  },
  // Michael Lee's employees
  {
    id: 'EMP006',
    _id: 'EMP006',
    employeeId: 'EMP006',
    name: 'Sophia Taylor',
    role: 'Employee',
    email: 'employee6@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    xp: 2600,
    level: 3,
    streak: 6,
    badges: [],
    department: 'Marketing',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$105,000',
    location: 'Remote',
    phone: '+1555300001',
    burnoutScore: 30,
    completedTasksCount: 14,
    pendingTasksCount: 1,
    commitsCount: 70,
    status: 'active',
    managerId: 'MGR002'
  },
  {
    id: 'EMP007',
    _id: 'EMP007',
    employeeId: 'EMP007',
    name: 'Liam Thomas',
    role: 'Employee',
    email: 'employee7@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    xp: 1700,
    level: 2,
    streak: 3,
    badges: [],
    department: 'Marketing',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$100,000',
    location: 'New York, NY',
    phone: '+1555300002',
    burnoutScore: 40,
    completedTasksCount: 9,
    pendingTasksCount: 2,
    commitsCount: 52,
    status: 'active',
    managerId: 'MGR002'
  },
  {
    id: 'EMP008',
    _id: 'EMP008',
    employeeId: 'EMP008',
    name: 'Ava White',
    role: 'Employee',
    email: 'employee8@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    xp: 3100,
    level: 4,
    streak: 8,
    badges: ['badge-1'],
    department: 'Marketing',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$108,000',
    location: 'New York, NY',
    phone: '+1555300003',
    burnoutScore: 22,
    completedTasksCount: 21,
    pendingTasksCount: 0,
    commitsCount: 105,
    status: 'active',
    managerId: 'MGR002'
  },
  {
    id: 'EMP009',
    _id: 'EMP009',
    employeeId: 'EMP009',
    name: 'Ethan Harris',
    role: 'Employee',
    email: 'employee9@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
    xp: 2150,
    level: 3,
    streak: 4,
    badges: [],
    department: 'Marketing',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$103,000',
    location: 'Remote',
    phone: '+1555300004',
    burnoutScore: 27,
    completedTasksCount: 13,
    pendingTasksCount: 1,
    commitsCount: 75,
    status: 'active',
    managerId: 'MGR002'
  },
  {
    id: 'EMP010',
    _id: 'EMP010',
    employeeId: 'EMP010',
    name: 'Mia Clark',
    role: 'Employee',
    email: 'employee10@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    xp: 2950,
    level: 3,
    streak: 6,
    badges: ['badge-2'],
    department: 'Marketing',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$108,000',
    location: 'Remote',
    phone: '+1555300005',
    burnoutScore: 19,
    completedTasksCount: 19,
    pendingTasksCount: 0,
    commitsCount: 90,
    status: 'active',
    managerId: 'MGR002'
  }
];

const normalizeId = (id?: string) => {
  if (!id) return '';
  const clean = id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  if (clean === 'mgr1') return 'mgr001';
  if (clean === 'mgr2') return 'mgr002';
  if (clean === 'emp1') return 'emp001';
  if (clean === 'emp2') return 'emp002';
  if (clean === 'emp3') return 'emp003';
  if (clean === 'emp4') return 'emp004';
  if (clean === 'emp5') return 'emp005';
  if (clean === 'emp6') return 'emp006';
  if (clean === 'emp7') return 'emp007';
  if (clean === 'emp8') return 'emp008';
  if (clean === 'emp9') return 'emp009';
  if (clean === 'emp10') return 'emp010';
  if (clean === 'adm1' || clean === 'ceo1') return 'ceo001';
  return clean;
};

const getRequesterUser = async (req: Request) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return null;
  const isDbConnected = mongoose.connection.readyState === 1;
  if (isDbConnected) {
    try {
      // Find user in DB using raw and normalized ID comparisons
      const cleanId = normalizeId(String(userId));
      const allUsers = await User.find({});
      const matched = allUsers.find(u => 
        normalizeId(u.employeeId) === cleanId || 
        normalizeId(u.id) === cleanId || 
        u.email?.toLowerCase() === String(userId).toLowerCase()
      );
      if (matched) return matched;

      return await User.findOne({
        $or: [
          { _id: mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(String(userId)) : null },
          { employeeId: String(userId) },
          { id: String(userId) }
        ].filter(Boolean)
      });
    } catch {
      return null;
    }
  }
  return MOCK_USERS.find((u: any) => 
    normalizeId(u.employeeId) === normalizeId(String(userId)) ||
    u.email?.toLowerCase() === String(userId).toLowerCase() ||
    (String(userId).toLowerCase() === 'adm-1' && u.role.toLowerCase() === 'admin') ||
    (String(userId).toLowerCase() === 'emp-1' && u.email === 'employee1@workquest.ai') ||
    (String(userId).toLowerCase() === 'mgr-1' && u.email === 'manager01@workquest.ai')
  ) || null;
};

// @route   GET /api/users
// @desc    Get all users list
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const requester = await getRequesterUser(req);
    const role = requester ? requester.role : (req.headers['x-user-role'] as string);

    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Returning filtered mock users.');
      if (!role) return res.json(MOCK_USERS);
      
      const roleLower = role.toLowerCase();
      if (roleLower === 'admin' || roleLower === 'executive') {
        return res.json(MOCK_USERS);
      } else if (roleLower === 'manager') {
        const reqEmpId = requester?.employeeId;
        return res.json(MOCK_USERS.filter((u: any) => normalizeId(u.employeeId) === normalizeId(reqEmpId) || normalizeId(u.managerId) === normalizeId(reqEmpId)));
      } else {
        const reqEmpId = requester?.employeeId;
        return res.json(MOCK_USERS.filter((u: any) => normalizeId(u.employeeId) === normalizeId(reqEmpId)));
      }
    }

    let query: any = {};
    if (requester) {
      const roleLower = requester.role.toLowerCase();
      if (roleLower === 'manager') {
        // Query to match both original and clean values in DB
        const reqEmpId = requester.employeeId;
        const cleanEmpId = normalizeId(reqEmpId);
        query = {
          $or: [
            { employeeId: reqEmpId },
            { managerId: reqEmpId },
            { employeeId: cleanEmpId },
            { managerId: cleanEmpId }
          ]
        };
      } else if (roleLower === 'employee') {
        const reqEmpId = requester.employeeId;
        query = {
          $or: [
            { employeeId: reqEmpId },
            { employeeId: normalizeId(reqEmpId) }
          ]
        };
      }
    }

    const users = await User.find(query).select('-passwordHash');
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve users directory.' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard rankings
router.get('/leaderboard', async (req: Request, res: Response): Promise<any> => {
  try {
    const requester = await getRequesterUser(req);
    const role = requester ? requester.role : (req.headers['x-user-role'] as string);

    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Returning mock leaderboard.');
      let filtered = [...MOCK_USERS];
      if (role) {
        const roleLower = role.toLowerCase();
        if (roleLower === 'manager') {
          const reqEmpId = requester?.employeeId;
          filtered = MOCK_USERS.filter((u: any) => normalizeId(u.employeeId) === normalizeId(reqEmpId) || normalizeId(u.managerId) === normalizeId(reqEmpId));
        } else if (roleLower === 'employee') {
          const reqEmpId = requester?.employeeId;
          filtered = MOCK_USERS.filter((u: any) => normalizeId(u.employeeId) === normalizeId(reqEmpId));
        }
      }
      const ranked = filtered
        .sort((a, b) => b.xp - a.xp)
        .map((u, idx) => ({ ...u, rank: idx + 1 }));
      return res.json(ranked);
    }

    let query: any = {};
    if (requester) {
      const roleLower = requester.role.toLowerCase();
      if (roleLower === 'manager') {
        const reqEmpId = requester.employeeId;
        const cleanEmpId = normalizeId(reqEmpId);
        query = {
          $or: [
            { employeeId: reqEmpId },
            { managerId: reqEmpId },
            { employeeId: cleanEmpId },
            { managerId: cleanEmpId }
          ]
        };
      } else if (roleLower === 'employee') {
        const reqEmpId = requester.employeeId;
        query = {
          $or: [
            { employeeId: reqEmpId },
            { employeeId: normalizeId(reqEmpId) }
          ]
        };
      }
    }

    const leaderboard = await User.find(query)
      .select('name email avatar role department xp level rank status employeeId managerId')
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

// @route   POST /api/users
// @desc    Create a new user (employee/manager)
router.post('/', async (req: Request, res: Response): Promise<any> => {
  const { name, email, role, department, salary } = req.body;
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const prefix = role === 'Manager' ? 'MGR' : role === 'Admin' ? 'ADM' : 'EMP';
    const randomId = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

    const newUserObj = {
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@workquest.ai`,
      role: role || 'Employee',
      department: department || 'Engineering',
      employeeId: randomId,
      salary: salary || '$115,000',
      passwordHash: bcrypt.hashSync('Password123!', 10),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      xp: 0,
      level: 1,
      streak: 5,
      skipsLeft: 1,
      streakFreezeActive: false,
      status: 'active',
      attendance: 95,
      burnoutScore: 15,
      completedTasksCount: 0,
      pendingTasksCount: 0,
      commitsCount: 0,
      location: 'San Francisco, CA',
      badges: [] as string[],
      joinedAt: new Date().toISOString().split('T')[0],
      themeColor: 'cyan',
      phone: '+1555000000',
      managerId: role === 'Employee' ? 'MGR001' : 'CEO001'
    };

    if (!isDbConnected) {
      console.log('⚠️ MongoDB offline. Simulating user creation.');
      const userWithId = { ...newUserObj, id: `user-${Date.now()}`, _id: `user-${Date.now()}` };
      MOCK_USERS.push(userWithId);
      const { io } = require('../server');
      if (io) {
        io.emit('user_created', userWithId);
      }
      return res.status(201).json(userWithId);
    }

    // Check if user already exists
    const existing = await User.findOne({ email: newUserObj.email });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const user = new User(newUserObj);
    await user.save();

    const { io } = require('../server');
    if (io) {
      io.emit('user_created', user);
    }

    return res.status(201).json(user);
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ error: 'Failed to create user.' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      console.log('⚠️ MongoDB offline. Simulating user deletion.');
      const index = MOCK_USERS.findIndex(u => u.id === id || u.employeeId === id || u._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'User record not found.' });
      }
      const deletedUser = MOCK_USERS.splice(index, 1)[0];
      const { io } = require('../server');
      if (io) {
        io.emit('user_deleted', { id: deletedUser.id || deletedUser.employeeId });
      }
      return res.json({ message: 'User deleted successfully', user: deletedUser });
    }

    // Find and delete user
    const user = await User.findOneAndDelete({
      $or: [
        { _id: mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : null },
        { employeeId: id }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    const { io } = require('../server');
    if (io) {
      io.emit('user_deleted', { id: user._id || user.employeeId });
    }

    return res.json({ message: 'User deleted successfully', user });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// @route   POST /api/users/add-xp
// @desc    Give XP to a team/department or specific employee
router.post('/add-xp', async (req: Request, res: Response): Promise<any> => {
  const { department, employeeId, xpAmount } = req.body;
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const amount = Number(xpAmount || 0);

    if (!isDbConnected) {
      console.log('⚠️ MongoDB offline. Simulating XP grant.');
      if (employeeId) {
        const user = MOCK_USERS.find(u => u.id === employeeId || u.employeeId === employeeId);
        if (user) {
          user.xp += amount;
          // Recalculate level
          user.level = Math.floor(user.xp / 1000) + 1;
        }
      } else if (department) {
        MOCK_USERS.forEach(u => {
          if (u.department.toLowerCase() === department.toLowerCase()) {
            u.xp += amount;
            u.level = Math.floor(u.xp / 1000) + 1;
          }
        });
      }
      const { io } = require('../server');
      if (io) {
        io.emit('xp_granted', { department, employeeId, xpAmount: amount });
      }
      return res.json({ message: `Granted ${amount} XP successfully.` });
    }

    if (employeeId) {
      const user = await User.findOneAndUpdate(
        { employeeId },
        { $inc: { xp: amount } },
        { new: true }
      );
      if (user) {
        user.level = Math.floor(user.xp / 1000) + 1;
        await user.save();
      }
    } else if (department) {
      const users = await User.find({ department: { $regex: new RegExp(`^${department}$`, 'i') } });
      for (const u of users) {
        u.xp += amount;
        u.level = Math.floor(u.xp / 1000) + 1;
        await u.save();
      }
    }

    const { io } = require('../server');
    if (io) {
      io.emit('xp_granted', { department, employeeId, xpAmount: amount });
    }

    return res.json({ message: `Granted ${amount} XP successfully.` });
  } catch (err) {
    console.error('Grant XP error:', err);
    return res.status(500).json({ error: 'Failed to grant XP.' });
  }
});

export default router;
