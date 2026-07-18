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

    const usersToInsert = [
      // CEO
      {
        name: 'John Anderson',
        email: 'admin01@workquest.ai',
        passwordHash,
        role: 'Admin',
        department: 'Executive',
        employeeId: 'CEO001',
        phone: '+1555000001',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
        xp: 5000,
        level: 5,
        status: 'active',
        attendance: 100,
        performanceScore: 9.8,
        burnoutScore: 5,
        completedTasksCount: 42,
        pendingTasksCount: 0,
        commitsCount: 154,
        location: 'San Francisco, CA',
        salary: '$180,000'
      },
      // Manager 1
      {
        name: 'Sarah Johnson',
        email: 'manager01@workquest.ai',
        passwordHash,
        role: 'Manager',
        department: 'Engineering',
        employeeId: 'MGR001',
        phone: '+1555100001',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80',
        xp: 4000,
        level: 4,
        status: 'active',
        attendance: 98,
        performanceScore: 9.2,
        burnoutScore: 12,
        completedTasksCount: 30,
        pendingTasksCount: 2,
        commitsCount: 120,
        location: 'New York, NY',
        salary: '$145,000',
        managerId: 'CEO001'
      },
      // Manager 2
      {
        name: 'Michael Lee',
        email: 'manager02@workquest.ai',
        passwordHash,
        role: 'Manager',
        department: 'Marketing',
        employeeId: 'MGR002',
        phone: '+1555100002',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
        xp: 4000,
        level: 4,
        status: 'active',
        attendance: 98,
        performanceScore: 9.2,
        burnoutScore: 12,
        completedTasksCount: 30,
        pendingTasksCount: 2,
        commitsCount: 120,
        location: 'New York, NY',
        salary: '$140,000',
        managerId: 'CEO001'
      },
      // Sarah Johnson's employees
      {
        name: 'Alex Carter',
        email: 'employee1@workquest.ai',
        passwordHash,
        role: 'Employee',
        department: 'Engineering',
        employeeId: 'EMP001',
        phone: '+1555200001',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        xp: 3420,
        level: 4,
        status: 'active',
        attendance: 96,
        performanceScore: 8.8,
        burnoutScore: 15,
        completedTasksCount: 18,
        pendingTasksCount: 1,
        commitsCount: 95,
        location: 'Austin, TX',
        salary: '$115,000',
        managerId: 'MGR001'
      },
      {
        name: 'Emma Wilson',
        email: 'employee2@workquest.ai',
        passwordHash,
        role: 'Employee',
        department: 'Engineering',
        employeeId: 'EMP002',
        phone: '+1555200002',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        xp: 1900,
        level: 2,
        status: 'active',
        attendance: 92,
        performanceScore: 7.9,
        burnoutScore: 45,
        completedTasksCount: 12,
        pendingTasksCount: 2,
        commitsCount: 65,
        location: 'Remote',
        salary: '$110,000',
        managerId: 'MGR001'
      },
      {
        name: 'Daniel Brown',
        email: 'employee3@workquest.ai',
        passwordHash,
        role: 'Employee',
        department: 'Engineering',
        employeeId: 'EMP003',
        phone: '+1555200003',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        xp: 3200,
        level: 4,
        status: 'active',
        attendance: 95,
        performanceScore: 8.5,
        burnoutScore: 20,
        completedTasksCount: 22,
        pendingTasksCount: 0,
        commitsCount: 110,
        location: 'Austin, TX',
        salary: '$115,000',
        managerId: 'MGR001'
      },
      {
        name: 'Olivia Davis',
        email: 'employee4@workquest.ai',
        passwordHash,
        role: 'Employee',
        department: 'Engineering',
        employeeId: 'EMP004',
        phone: '+1555200004',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        xp: 2200,
        level: 3,
        status: 'active',
        attendance: 94,
        performanceScore: 8.2,
        burnoutScore: 28,
        completedTasksCount: 15,
        pendingTasksCount: 1,
        commitsCount: 78,
        location: 'Austin, TX',
        salary: '$112,000',
        managerId: 'MGR001'
      },
      {
        name: 'Noah Miller',
        email: 'employee5@workquest.ai',
        passwordHash,
        role: 'Employee',
        department: 'Engineering',
        employeeId: 'EMP005',
        phone: '+1555200005',
        avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
        xp: 2800,
        level: 3,
        status: 'active',
        attendance: 97,
        performanceScore: 8.6,
        burnoutScore: 18,
        completedTasksCount: 20,
        pendingTasksCount: 0,
        commitsCount: 92,
        location: 'Remote',
        salary: '$115,000',
        managerId: 'MGR001'
      },
      // Michael Lee's employees
      {
        name: 'Sophia Taylor',
        email: 'employee6@workquest.ai',
        passwordHash,
        role: 'Employee',
        department: 'Marketing',
        employeeId: 'EMP006',
        phone: '+1555300001',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        xp: 2600,
        level: 3,
        status: 'active',
        attendance: 93,
        performanceScore: 8.1,
        burnoutScore: 30,
        completedTasksCount: 14,
        pendingTasksCount: 1,
        commitsCount: 70,
        location: 'Remote',
        salary: '$105,000',
        managerId: 'MGR002'
      },
      {
        name: 'Liam Thomas',
        email: 'employee7@workquest.ai',
        passwordHash,
        role: 'Employee',
        department: 'Marketing',
        employeeId: 'EMP007',
        phone: '+1555300002',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        xp: 1700,
        level: 2,
        status: 'active',
        attendance: 91,
        performanceScore: 7.5,
        burnoutScore: 40,
        completedTasksCount: 9,
        pendingTasksCount: 2,
        commitsCount: 52,
        location: 'New York, NY',
        salary: '$100,000',
        managerId: 'MGR002'
      },
      {
        name: 'Ava White',
        email: 'employee8@workquest.ai',
        passwordHash,
        role: 'Employee',
        department: 'Marketing',
        employeeId: 'EMP008',
        phone: '+1555300003',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        xp: 3100,
        level: 4,
        status: 'active',
        attendance: 95,
        performanceScore: 8.4,
        burnoutScore: 22,
        completedTasksCount: 21,
        pendingTasksCount: 0,
        commitsCount: 105,
        location: 'New York, NY',
        salary: '$108,000',
        managerId: 'MGR002'
      },
      {
        name: 'Ethan Harris',
        email: 'employee9@workquest.ai',
        passwordHash,
        role: 'Employee',
        department: 'Marketing',
        employeeId: 'EMP009',
        phone: '+1555300004',
        avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
        xp: 2150,
        level: 3,
        status: 'active',
        attendance: 94,
        performanceScore: 8.0,
        burnoutScore: 27,
        completedTasksCount: 13,
        pendingTasksCount: 1,
        commitsCount: 75,
        location: 'Remote',
        salary: '$103,000',
        managerId: 'MGR002'
      },
      {
        name: 'Mia Clark',
        email: 'employee10@workquest.ai',
        passwordHash,
        role: 'Employee',
        department: 'Marketing',
        employeeId: 'EMP010',
        phone: '+1555300005',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        xp: 2950,
        level: 3,
        status: 'active',
        attendance: 96,
        performanceScore: 8.5,
        burnoutScore: 19,
        completedTasksCount: 19,
        pendingTasksCount: 0,
        commitsCount: 90,
        location: 'Remote',
        salary: '$108,000',
        managerId: 'MGR002'
      }
    ];

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
