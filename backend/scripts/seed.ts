import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User';
import Task from '../models/Task';
import Department from '../models/Department';
import Marketplace from '../models/Marketplace';
import Notification from '../models/Notification';
import { connectDB } from '../db';

const DEPARTMENTS = [
  { name: 'Frontend Engineering', code: 'FE' },
  { name: 'Backend Engineering', code: 'BE' },
  { name: 'AI Research', code: 'AI' },
  { name: 'DevOps', code: 'DO' },
  { name: 'Cloud Engineering', code: 'CE' },
  { name: 'Cyber Security', code: 'CS' },
  { name: 'QA', code: 'QA' },
  { name: 'UI/UX', code: 'UI' },
  { name: 'Data Science', code: 'DS' }
];

const REWARDS = [
  {
    title: 'Mechanical Keyboard',
    description: 'Tactile mechanical keyboard with customizable RGB backlights and premium titanium shell.',
    cost: 1200,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400',
    category: 'Hardware'
  },
  {
    title: 'Wireless Mouse',
    description: 'Ergonomic high-precision wireless mouse with custom sensor calibration nodes.',
    cost: 800,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400',
    category: 'Hardware'
  },
  {
    title: 'Gaming Headset',
    description: 'Active noise-canceling stereo gaming headset with low-latency microphone sweeps.',
    cost: 1500,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
    category: 'Audio'
  },
  {
    title: 'Amazon Gift Card ($50)',
    description: 'Amazon electronic voucher to purchase reference technical books or gadgets.',
    cost: 1000,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
    category: 'Vouchers'
  },
  {
    title: 'Steam Gift Card ($50)',
    description: 'Claim credits for tactical team building simulators and gaming sandboxes.',
    cost: 1000,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400',
    category: 'Vouchers'
  },
  {
    title: 'Coffee Voucher',
    description: 'Hot beverage subscription card containing 10 premium espresso claims.',
    cost: 300,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    category: 'Beverages'
  },
  {
    title: 'Extra Leave Day',
    description: 'Accrue one full day of paid rest. Rest periods prevent burnout alerts.',
    cost: 2000,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    category: 'TimeOff'
  },
  {
    title: 'Wireless Earbuds',
    description: 'Water-resistant true wireless earbuds with magnetic docking pods.',
    cost: 1800,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    category: 'Audio'
  },
  {
    title: 'Monitor Voucher ($100)',
    description: 'Partial checkout code to purchase ultra-wide external workstation screens.',
    cost: 2000,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    category: 'Vouchers'
  },
  {
    title: 'Laptop Backpack',
    description: 'Lunar white carbon-fiber reinforced anti-theft workstation gear pack.',
    cost: 700,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    category: 'Travel'
  }
];

const TASK_TEMPLATES = [
  { title: 'Refactor Core State Engine', desc: 'Optimize Redux/Context state variables to clear memory leaks on browser unmounts.' },
  { title: 'Implement JWT Token Rotation', desc: 'Secure Express API endpoints using short-lived tokens and HTTP-only cookie rotation.' },
  { title: 'Optimize WebGL Shader Nodes', desc: 'Simplify fragment shader rendering logic in custom particle canvas for 60 FPS mobile velocity.' },
  { title: 'Audit AWS ECS Container Memory', desc: 'Track CPU spikes on production load balancer pipelines and scale cluster thresholds.' },
  { title: 'Design Glassmorphic Profile Portal', desc: 'Code CSS layouts for user cards with floating neon tags and responsive hover matrix scales.' },
  { title: 'Deploy MongoDB Multi-Region Replica Set', desc: 'Establish cluster backups and reduce read latency metrics for secondary dev nodes.' },
  { title: 'Mitigate Redis Cache Collisions', desc: 'Review cache invalidation schemas during batch client request updates.' },
  { title: 'Write Playwright E2E Integration Suite', desc: 'Automate dashboard access paths, login mocks, and checkout forms testing.' },
  { title: 'Configure GitHub Actions CI/CD Pipeline', desc: 'Automate build runs, ESLint scans, and Docker container pushes on master commit triggers.' },
  { title: 'Tune Gemini Prompt Vector Parameters', desc: 'Refine system instruction templates for accurate burnout indexes diagnostics.' }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️ Wiping existing collections...');
    await User.deleteMany({});
    await Task.deleteMany({});
    await Department.deleteMany({});
    await Marketplace.deleteMany({});
    await Notification.deleteMany({});

    console.log('🏢 Seeding Departments...');
    await Department.insertMany(DEPARTMENTS);

    console.log('🔑 Hashing password node...');
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const usersToInsert = [];

    // 1. Generate 1 Admin
    for (let i = 1; i <= 1; i++) {
      usersToInsert.push({
        name: `Admin Commander 0${i}`,
        email: `admin0${i}@workquest.ai`,
        passwordHash,
        role: 'Admin',
        department: 'DevOps',
        employeeId: `ADM-00${i}`,
        phone: `+155500000${i}`,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80`,
        xp: 5000,
        level: 5,
        status: 'active',
        attendance: 100,
        performanceScore: 9.8,
        burnoutScore: 5,
        completedTasksCount: 42,
        pendingTasksCount: 0,
        commitsCount: 154,
        location: 'San Francisco, CA'
      });
    }

    // 2. Generate 2 Managers
    for (let i = 1; i <= 2; i++) {
      const dept = DEPARTMENTS[(i - 1) % DEPARTMENTS.length];
      usersToInsert.push({
        name: `Manager Leader 0${i}`,
        email: `manager0${i}@workquest.ai`,
        passwordHash,
        role: 'Manager',
        department: dept.name,
        employeeId: `MGR-00${i}`,
        phone: `+155510000${i}`,
        avatar: `https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80`,
        xp: 4000,
        level: 4,
        status: 'active',
        attendance: 98,
        performanceScore: 9.2,
        burnoutScore: 12,
        completedTasksCount: 30,
        pendingTasksCount: 2,
        commitsCount: 120,
        location: 'New York, NY'
      });
    }

    // 3. Generate 20 Employees
    const employeeAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    ];

    for (let i = 1; i <= 5; i++) {
      const dept = DEPARTMENTS[i % DEPARTMENTS.length];
      const xp = 500 + Math.floor(Math.random() * 2500);
      const level = Math.floor(xp / 1000) + 1;
      usersToInsert.push({
        name: `Developer Engineer 0${i}`,
        email: `employee${i}@workquest.ai`,
        passwordHash,
        role: 'Employee',
        department: dept.name,
        employeeId: `EMP-0${i < 10 ? '0' : ''}${i}`,
        phone: `+155520000${i}`,
        avatar: employeeAvatars[i % employeeAvatars.length],
        xp,
        level,
        status: 'active',
        attendance: 88 + Math.floor(Math.random() * 12),
        performanceScore: Number((6.5 + Math.random() * 3.5).toFixed(1)),
        burnoutScore: Math.floor(10 + Math.random() * 75),
        completedTasksCount: 5 + Math.floor(Math.random() * 25),
        pendingTasksCount: 1 + Math.floor(Math.random() * 5),
        commitsCount: 30 + Math.floor(Math.random() * 150),
        location: i % 2 === 0 ? 'Remote' : 'Austin, TX'
      });
    }

    console.log('👥 Inserting Users...');
    const insertedUsers = await User.insertMany(usersToInsert);

    // Bind department managers
    const managers = insertedUsers.filter(u => u.role === 'Manager');
    for (const mgr of managers) {
      await Department.findOneAndUpdate({ name: mgr.department }, { managerId: mgr.employeeId });
    }

    console.log('🛍️ Seeding Marketplace catalog...');
    await Marketplace.insertMany(REWARDS);

    console.log('📋 Seeding 30 realistic tasks...');
    const employees = insertedUsers.filter(u => u.role === 'Employee');
    const tasksToInsert = [];

    const difficultyXp: Record<string, number> = {
      easy: 10,
      medium: 30,
      hard: 60,
      extreme: 120
    };

    const difficultyList: ('easy' | 'medium' | 'hard' | 'extreme')[] = ['easy', 'medium', 'hard', 'extreme'];
    const priorityList: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const statusList: ('todo' | 'in_progress' | 'in_review' | 'completed')[] = ['todo', 'in_progress', 'in_review', 'completed'];

    for (let i = 0; i < 30; i++) {
      const template = TASK_TEMPLATES[i % TASK_TEMPLATES.length];
      const employee = employees[i % employees.length];
      const manager = managers[i % managers.length];
      
      const difficulty = difficultyList[i % difficultyList.length];
      const priority = priorityList[i % priorityList.length];
      const status = statusList[i % statusList.length];
      
      const xpReward = difficultyXp[difficulty] || 30;
      const estimatedHours = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 6 : difficulty === 'hard' ? 12 : 24;
      const actualHours = status === 'completed' ? Math.max(1, estimatedHours + Math.floor((Math.random() - 0.5) * 4)) : undefined;

      const dueDate = new Date(Date.now() + (Math.floor(Math.random() * 20) - 10) * 86400000).toISOString().split('T')[0];

      tasksToInsert.push({
        title: `${template.title} #${i + 1}`,
        description: `${template.desc} Verify performance buffers and coordinate telemetry reports.`,
        difficulty,
        priority,
        dueDate,
        xp: xpReward,
        assignedTo: employee.employeeId,
        assignedToName: employee.name,
        assignedBy: manager.employeeId,
        status,
        estimatedHours,
        actualHours,
        qualityScore: status === 'completed' ? 7 + Math.floor(Math.random() * 4) : undefined,
        feedback: status === 'completed' ? 'Verified performance metrics meet deployment standards.' : undefined,
        commentsCount: Math.floor(Math.random() * 3)
      });
    }

    await Task.insertMany(tasksToInsert);
    console.log('✅ Database seeded successfully with mock data plexus!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failure:', error);
    process.exit(1);
  }
};

seedDatabase();
