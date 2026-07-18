import { Router, Request, Response } from 'express';
import Task from '../models/Task';
import User from '../models/User';
import { io } from '../server';
import { authenticateToken } from '../middleware/auth';
import mongoose from 'mongoose';

const router = Router();

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
  return null;
};

// @route   GET /api/tasks
// @desc    Get all tasks or filter by assignee
router.get('/', async (req: Request, res: Response): Promise<any> => {
  const { assignedTo } = req.query;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Returning empty task array.');
      return res.json([]);
    }

    const requester = await getRequesterUser(req);
    let filter: any = {};

    if (requester) {
      const roleLower = requester.role.toLowerCase();
      if (roleLower === 'employee') {
        filter = { 
          $or: [
            { assignedTo: requester.employeeId },
            { assignedTo: normalizeId(requester.employeeId) }
          ]
        };
      } else if (roleLower === 'manager') {
        const cleanMgrId = normalizeId(requester.employeeId);
        const allUsers = await User.find({});
        const teamEmpIds = allUsers
          .filter(u => normalizeId(u.managerId) === cleanMgrId || normalizeId(u.employeeId) === cleanMgrId)
          .map(u => u.employeeId);
        
        filter = {
          assignedTo: { $in: [...teamEmpIds, requester.employeeId, cleanMgrId] }
        };
      }
    }

    if (assignedTo) {
      if (requester && requester.role.toLowerCase() === 'employee' && normalizeId(String(assignedTo)) !== normalizeId(requester.employeeId)) {
        return res.status(403).json({ error: 'Access Denied. You can only access your own tasks.' });
      }
      filter.assignedTo = String(assignedTo);
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve tasks checklist.' });
  }
});

// @route   POST /api/tasks/assign
// @desc    Allocate a new sprint ticket task
router.post('/assign', async (req: Request, res: Response): Promise<any> => {
  const { title, description, difficulty, xp, assignedTo, assignedToName, assignedBy, estimatedHours } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Returning mock created task.');
      const newTask = {
        id: `task-${Date.now()}`,
        title,
        description,
        difficulty,
        xp: Number(xp),
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        status: 'todo',
        assignedTo,
        assignedToName,
        assignedBy,
        estimatedHours: Number(estimatedHours || 4),
        commentsCount: 0
      };
      if (io) {
        io.emit('task_assigned', newTask);
      }
      return res.status(201).json(newTask);
    }

    const newTask = new Task({
      title,
      description,
      difficulty,
      xp: Number(xp),
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'todo',
      assignedTo,
      assignedToName,
      assignedBy,
      estimatedHours: Number(estimatedHours || 4),
      commentsCount: 0
    });

    await newTask.save();

    // Increment pending tasks count on assignee
    await User.findOneAndUpdate(
      { employeeId: assignedTo },
      { $inc: { pendingTasksCount: 1 } }
    );

    // Emit Socket.io real-time broadcast
    if (io) {
      io.emit('task_assigned', newTask);
    }

    return res.status(201).json(newTask);
  } catch (err) {
    console.error('Assign task error:', err);
    return res.status(500).json({ error: 'Failed to deploy task ticket.' });
  }
});

// @route   PUT /api/tasks/:id/status
// @desc    Update task board lane status
router.put('/:id/status', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Simulating status update.');
      const mockTask = {
        id,
        status,
        title: 'Task Title (Simulated)',
        assignedToName: 'Developer Engineer 01'
      };
      if (status === 'in_review' && io) {
        io.emit('task_pending_review', mockTask);
      }
      return res.json(mockTask);
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const oldStatus = task.status;
    task.status = status;
    await task.save();

    // Adjust user pending/completed counters if changing status
    if (status === 'completed' && oldStatus !== 'completed') {
      await User.findOneAndUpdate(
        { employeeId: task.assignedTo },
        { $inc: { pendingTasksCount: -1, completedTasksCount: 1 } }
      );
    } else if (oldStatus === 'completed' && status !== 'completed') {
      await User.findOneAndUpdate(
        { employeeId: task.assignedTo },
        { $inc: { pendingTasksCount: 1, completedTasksCount: -1 } }
      );
    }

    if (status === 'in_review' && io) {
      io.emit('task_pending_review', task);
    }

    return res.json(task);
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({ error: 'Failed to update task lane status.' });
  }
});

// @route   POST /api/tasks/:id/approve
// @desc    Manager approves submission and grants XP/level nodes
router.post('/:id/approve', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { qualityScore, feedback } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Simulating task approval.');
      const mockApproved = {
        id,
        status: 'completed',
        title: 'Task Title (Simulated)',
        assignedToName: 'Developer Engineer 01',
        xp: 60,
        qualityScore,
        feedback
      };
      if (io) {
        io.emit('task_approved_broadcast', {
          taskId: id,
          employeeName: 'Developer Engineer 01',
          taskTitle: 'Task Title (Simulated)',
          xpEarned: 60,
          qualityScore
        });
      }
      return res.json({ message: 'Task approved and XP granted (Simulated)', task: mockApproved });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const wasCompleted = task.status === 'completed';

    task.status = 'completed';
    task.qualityScore = Number(qualityScore || 9);
    task.feedback = feedback || 'Task approved.';
    await task.save();

    // If not previously completed, adjust user metrics & grant XP
    if (!wasCompleted) {
      const user = await User.findOne({ employeeId: task.assignedTo });
      if (user) {
        const oldXp = user.xp;
        const newXp = oldXp + task.xp;
        const newLevel = Math.floor(newXp / 1000) + 1;

        user.xp = newXp;
        user.level = newLevel;
        user.completedTasksCount += 1;
        if (user.pendingTasksCount > 0) user.pendingTasksCount -= 1;
        await user.save();
      }
    }

    if (io) {
      io.emit('task_approved_broadcast', {
        taskId: id,
        employeeName: task.assignedToName,
        taskTitle: task.title,
        xpEarned: task.xp,
        qualityScore
      });
    }

    return res.json({ message: 'Task approved and XP granted', task });
  } catch (err) {
    console.error('Approve task error:', err);
    return res.status(500).json({ error: 'Verification approval execution failed.' });
  }
});

export default router;
