const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store active rooms
const rooms = new Map();

// Generate a random room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new room
  socket.on('create_room', (username) => {
    const roomCode = generateRoomCode();
    rooms.set(roomCode, {
      users: [{ id: socket.id, username }],
      messages: []
    });
    socket.join(roomCode);
    socket.emit('room_created', { roomCode, username });
  });

  // Join an existing room
  socket.on('join_room', ({ roomCode, username }) => {
    const room = rooms.get(roomCode);
    if (room) {
      room.users.push({ id: socket.id, username });
      socket.join(roomCode);
      socket.emit('room_joined', { roomCode, username, users: room.users, messages: room.messages });
      io.to(roomCode).emit('user_joined', { username, users: room.users });
    } else {
      socket.emit('room_error', { message: 'Room not found' });
    }
  });

  // Handle chat messages
  socket.on('send_message', ({ roomCode, message, username }) => {
    const room = rooms.get(roomCode);
    if (room) {
      const newMessage = { text: message, username, timestamp: new Date() };
      room.messages.push(newMessage);
      io.to(roomCode).emit('receive_message', newMessage);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and remove user from their room
    for (const [roomCode, room] of rooms.entries()) {
      const userIndex = room.users.findIndex(user => user.id === socket.id);
      if (userIndex !== -1) {
        const username = room.users[userIndex].username;
        room.users.splice(userIndex, 1);
        io.to(roomCode).emit('user_left', { username, users: room.users });
        
        // If room is empty, delete it
        if (room.users.length === 0) {
          rooms.delete(roomCode);
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 