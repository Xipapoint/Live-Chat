import { WebSocketServer, WebSocket } from 'ws';
import { handleMessage } from './messageHandler';

export function handleConnection(wss: WebSocketServer, ws: WebSocket): void {
  console.log('New client connected');

  ws.on('message', (data: string) => {
    handleMessage(wss, ws, data);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('join', (roomId: string) => {
    (ws as any).roomId = roomId;
  });
}