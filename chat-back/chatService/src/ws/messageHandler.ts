import { WebSocketServer, WebSocket } from 'ws';
import Message  from '../models/messageModel';
import Room  from '../models/roomModel';
import { IMessage } from '../models/messageModel';
import { IRoom } from '../models/roomModel';
import { Types } from 'mongoose';

interface ParsedData {
  roomId: string;
  user: string;
  message: string;
}

export async function handleMessage(wss: WebSocketServer, ws: WebSocket, data: string): Promise<void> {
  try {
    const parsedData: ParsedData = JSON.parse(data);
    const { roomId, user, message } = parsedData;

    // Создание и сохранение нового сообщения в базе данных
    const newMessage = new Message({ user, message });
    await newMessage.save();

    // Обновление комнаты: добавление нового сообщения
    const room = await Room.findById(roomId).populate('messages');
    if (room) {
      room.messages.push(newMessage);
      await room.save();

      // Отправка сохраненного сообщения обратно всем подключенным клиентам в комнате
      const savedMessage = await newMessage.populate('user');
      const broadcastData = JSON.stringify({ roomId, ...savedMessage.toObject() });

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
