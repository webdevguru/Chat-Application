import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
dotenv.config();

import express from 'express';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import chatRoutes from './routes/ChatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';

connectDB();

const app = express();
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send("API is running");
});
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: "https://glowing-moonbeam-34f320.netlify.app",
    credentials: true,
  })
);   /// new line added

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  const handleSetup = (userData) => {
    socket.join(userData._id);
    console.log("User joined room:", userData._id);
    socket.emit("connected");
  };

  const handleJoinChat = (room) => {
    socket.join(room);
    console.log("User Joined Room:", room);
  };

  const handleLeaveChat = (room) => {
    socket.leave(room);
    console.log("User Left Room:", room);
  };

  const handleTyping = (room) => {
    socket.in(room).emit('typing');
  };

  const handleStopTyping = (room) => {
    socket.in(room).emit('stop typing');
  };

  const handleNewMessage = (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if(!chat.users) return;

    console.log("New message received:", newMessageReceived);
    
    chat.users.forEach((user) => {
      if(user._id === newMessageReceived.sender._id) return;
      console.log("Emitting message to user:", user._id);
      socket.in(user._id).emit('message received', newMessageReceived);
    });
  };

  const handleDisconnect = () => {
    console.log("User Disconnected");
  };

  // Register event listeners
  socket.on("setup", handleSetup);
  socket.on('join chat', handleJoinChat);
  socket.on('leave chat', handleLeaveChat);
  socket.on('typing', handleTyping);
  socket.on('stop typing', handleStopTyping);
  socket.on('new message', handleNewMessage);
  socket.on("disconnect", handleDisconnect);

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    socket.off("setup", handleSetup);
    socket.off('join chat', handleJoinChat);
    socket.off('leave chat', handleLeaveChat);
    socket.off('typing', handleTyping);
    socket.off('stop typing', handleStopTyping);
    socket.off('new message', handleNewMessage);
    socket.off("disconnect", handleDisconnect);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
