"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Critical: Configure environment variables before importing routes
dotenv_1.default.config({ path: path_1.default.join(__dirname, '.env') });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
// Import route components
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const rewards_1 = __importDefault(require("./routes/rewards"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const achievements_1 = __importDefault(require("./routes/achievements"));
const ai_1 = __importDefault(require("./routes/ai"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
    },
});
exports.io = io;
// Database connection
(0, db_1.connectDB)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes middleware integration
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/tasks', tasks_1.default);
app.use('/api/rewards', rewards_1.default);
app.use('/api/marketplace', rewards_1.default); // Dual bind rewards to satisfy marketplace spec
app.use('/api/notifications', notifications_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/achievements', achievements_1.default);
app.use('/api/ai', ai_1.default);
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
