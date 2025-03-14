# zap-chat

A real-time chat application built with React, Node.js, and Socket.IO. Users can create chat rooms or join existing ones using room codes.

## Features

- Create new chat rooms
- Join existing rooms using room codes
- Real-time messaging
- User presence indicators

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:3001

2. In a new terminal, start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on http://localhost:5173

3. Open http://localhost:5173 in your browser

## How to Use

1. Enter your username
2. Either:
   - Click "Create New Room" to create a new chat room
   - Enter a room code and click "Join Room" to join an existing room
3. Share the room code with others to let them join your room
4. Start chatting!

## Technologies Used

- Frontend:
  - React
  - Vite
  - Socket.IO Client

- Backend:
  - Node.js
  - Express
  - Socket.IO
  - CORS 