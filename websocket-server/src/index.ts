import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { SocketHandlers } from './handlers/socketHandlers';
import { config } from './config/config';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: config.ORIGIN }
});

app.use(cors());

app.get('/', (request: Request, response: Response) => {
    response.status(200).send('Hello World!!');
});

const socketHandlers = new SocketHandlers();

io.on('connection', (socket) => {
    socketHandlers.handleConnection(socket);
});

httpServer.listen(config.PORT, () => {
    console.log('Server running at PORT: ', config.PORT);
}).on('error', (error) => {
    throw new Error(error.message);
});
