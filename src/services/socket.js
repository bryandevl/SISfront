import { io } from 'socket.io-client';

// Configuración del cliente Socket.IO
const socket = io('http://localhost:5000', {
  transports: ['websocket'], // Usar WebSocket directamente
  withCredentials: true, // Permitir credenciales
});

export default socket;
