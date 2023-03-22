import http from 'http';
import { Server } from 'socket.io';
import app from '../app.js';
import { setChatListeners } from './setChatListeners.js';

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket): void => {
    setChatListeners(socket, io);
});

export { server };
