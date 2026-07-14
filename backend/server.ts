import dotenv from 'dotenv';
import path from 'path';

// Critical: Configure environment variables before importing routes
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectDB } from './db';

// Import route components
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import taskRoutes from './routes/tasks';
import rewardRoutes from './routes/rewards';
import notificationRoutes from './routes/notifications';
import analyticsRoutes from './routes/analytics';
import achievementRoutes from './routes/achievements';
import aiRoutes from './routes/ai';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
  },
});

// Database connection
connectDB();

app.use(cors() as any);
app.use(express.json());

// Routes middleware integration
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/marketplace', rewardRoutes); // Dual bind rewards to satisfy marketplace spec
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/ai', aiRoutes);

// Socket.io Real-time connections
io.on('connection', (socket) => {
  console.log('⚡ A user connected to WorkQuest AI real-time socket:', socket.id);

  socket.on('join_department', (deptName) => {
    socket.join(deptName);
    console.log(`👤 User joined department group: ${deptName}`);
  });

  socket.on('task_completed_event', (data) => {
    io.to(data.department).emit('notify_task_completed', {
      employeeName: data.employeeName,
      taskTitle: data.taskTitle,
      xpEarned: data.xpEarned,
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected from socket');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 WorkQuest AI Backend Running on port ${PORT}`);
});

export { io };
