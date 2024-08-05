import { WebSocketServer, WebSocket } from 'ws';
import Message from '../models/messageModel';
import Room from '../models/roomModel';
import { IMessage } from '../models/messageModel';
import { IRoom } from '../models/roomModel';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';

interface ParsedData {
  roomId: string;
  userId: string;
  message: string;
}

export async function handleMessage(wss: WebSocketServer, ws: WebSocket, data: string): Promise<void> {
  try {
    const parsedData: ParsedData = JSON.parse(data);
    const { roomId, userId, message } = parsedData;
    console.log(userId);
    
    const newMessage = new Message({ roomId, userId, message });
    await newMessage.save();

    const room = await Room.findById(roomId);
    if (room) {
      room.messages.push(newMessage);
      room.lastMessage = newMessage;
      await room.save();

      const broadcastData = JSON.stringify({...newMessage.toObject() });

      // Отправляем сообщение всем клиентам в данной комнате
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && (client as any).roomId === roomId) {
          client.send(broadcastData);
        }
      });
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
}
