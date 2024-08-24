import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { createNotification } from './wsMessageHandler';
import { SetNotificationUserMessageRequestMessage } from '../rabbitmq/types/request/notification/NotificationMessage.types';

export function handleConnection(wss: WebSocketServer, ws: WebSocket, req: http.IncomingMessage, RabbitMessage: SetNotificationUserMessageRequestMessage): void {
  const url = new URL(req.url as string, `http://${req.headers.host}`);
  const userId = url.searchParams.get('userId');
  
  if (userId) {
    console.log("notification user id:", userId);
    
    (ws as any).userId = userId;
    createNotification(wss, ws, RabbitMessage)
    console.log(`New client connected to room: ${userId}`);
  } else {
    console.log('New client connected without userId');
  }

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}