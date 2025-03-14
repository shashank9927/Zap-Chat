import io from 'socket.io-client';

const socket = io('https://zapchat-1x7p.onrender.com', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

export default socket; 
