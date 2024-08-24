import { WebSocketServer, WebSocket } from 'ws';
import { handleMessage } from './wsMessageHandler';
import http from 'http';

export function handleConnection(wss: WebSocketServer, ws: WebSocket, req: http.IncomingMessage): void {
  const url = new URL(req.url as string, `http://${req.headers.host}`);
  const roomId = url.searchParams.get('roomId');
  
  if (roomId) {
    console.log(roomId);
    
    (ws as any).roomId = roomId;
    console.log(`New client connected to room: ${roomId}`);
  } else {
    console.log('New client connected without roomId');
  }

  ws.on('message', (data: string) => {
    handleMessage(wss, ws, data);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}