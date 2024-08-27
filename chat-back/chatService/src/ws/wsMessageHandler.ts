import { WebSocketServer, WebSocket } from 'ws';
import Message from '../models/messageModel';
import Room from '../models/roomModel';
import { IMessage } from '../models/messageModel';
import { IRoom } from '../models/roomModel';
import { Document, Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import producer from '../rabbitMQ/producer';
import { GetNamesRequestMessage, SetNotificationUserMessageRequestMessage } from '../rabbitMQ/types/request/requestTypes';
import messageService from '../services/messageService';
import { IMessageWithReplyResponse } from '../dto/response/MessageWithReplyResponse.interface';
import { GetNamesResponse } from '../rabbitMQ/types/response/responseTypes';

interface ParsedData {
  roomId: string;
  userId: string;
  message: string;
  replyingMessageId?: string,
  isReplying: boolean
}

export async function handleMessage(wss: WebSocketServer, ws: WebSocket, data: string): Promise<void> {
  try {
    const parsedData: ParsedData = JSON.parse(data);
    const { roomId, userId, message, replyingMessageId, isReplying } = parsedData;
    console.log(userId);

    const room = await Room.findById(roomId);
    if (room) {
      const getNamesM: GetNamesRequestMessage = {
        serviceType: 'getNames',
        data: {
            id:  userId
        }
      }
      const {secondFirstName, secondLastName} = await producer.publishMessage<GetNamesResponse>(getNamesM)
      const newMessage = isReplying ? 
      await messageService.replyOnMessage(replyingMessageId as string, roomId, userId, message, secondFirstName, secondLastName) :
      new Message({ roomId, userId, message })

    const messageToPush = newMessage as (Document<unknown, {}, IMessage> & IMessage & Required<{
      _id: Types.ObjectId;
  }>) || (newMessage as IMessageWithReplyResponse).message
      room.messages.push(messageToPush);
      room.lastMessage = messageToPush;
      await room.save();

      const broadcastData = JSON.stringify({...messageToPush.toObject() });

      wss.clients.forEach(async (client) => {
        if (client.readyState === WebSocket.OPEN && (client as any).roomId === roomId) {
          const setNotification: SetNotificationUserMessageRequestMessage = {
            serviceType: 'setNotificationUserMessage',
            data: {
                message: messageToPush.message,
                userId: messageToPush.userId.toString()
            }
          }
          console.log("notification", setNotification);
          
          client.send(broadcastData);
          await producer.publishMessage(setNotification)
        }
      });
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
}
