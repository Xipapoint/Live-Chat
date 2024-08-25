import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { createNotification } from './wsMessageHandler';
import { SetNotificationUserMessageRequestMessage } from '../rabbitmq/types/request/notification/NotificationMessage.types';

export async function handleConnection(wss: WebSocketServer, ws: WebSocket, req: http.IncomingMessage, RabbitMessage: SetNotificationUserMessageRequestMessage): Promise<void> {
  const url = new URL(req.url as string, `http://${req.headers.host}`);
  const userId = url.searchParams.get('userId');
  
  if (userId) {
    console.log("notification user id:", userId);
    
    (ws as any).userId = userId;
    ws.on('message', async (data) => {
      console.log('Received message from client:', data.toString());

      const clientMessage = JSON.parse(data.toString());

      await createNotification(wss, ws, RabbitMessage);
    });
    console.log(`New client connected to room: ${userId}`);
  } else {
    console.log('New client connected without userId');
  }

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}