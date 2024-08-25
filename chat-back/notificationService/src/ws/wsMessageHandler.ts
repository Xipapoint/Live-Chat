import { WebSocketServer, WebSocket } from 'ws';
import Notification, {INotification} from '../models/NotificationModel';
import producer from '../rabbitmq/producer';
import { GetNamesRequestMessage } from '../rabbitmq/types/request/user/UserMessage.types';
import { GetNamesResponse } from '../rabbitmq/types/response/responseTypes';
import { SetNotificationUserMessageRequestMessage } from '../rabbitmq/types/request/notification/NotificationMessage.types';

export async function sendNotification(wss: WebSocketServer, notification: INotification) {
  const broadcastData = JSON.stringify(notification.toObject());
  console.log("вызвали");
  
  wss.clients.forEach((client) => {
    const clientUserId = (client as any).userId;
    console.log(`Client ID: ${clientUserId}, Notification sender ID: ${notification.userId}`);
    
    if (client.readyState === WebSocket.OPEN && clientUserId !== notification.userId.toString()) {
        console.log("отправил");
        client.send(broadcastData);
    }
});
}

export async function createNotification(wss: WebSocketServer, ws: WebSocket, RabbitMessage: SetNotificationUserMessageRequestMessage): Promise<void> {
  try {
    const { userId, message } = RabbitMessage.data;
    if(typeof userId !== 'string') throw new Error("user id isnt valid")
      const getNamesM: GetNamesRequestMessage = {
        serviceType: 'getNames',
        data: {
            id: userId
        }
    }
    const{secondFirstName, secondLastName} = await producer.publishMessage<GetNamesResponse>(getNamesM)
    const newNotification = new Notification({ 
      userId: userId, 
      senderFirstName: secondFirstName,
      senderLastName: secondLastName, 
      content: message 
    });
    console.log("new notification:", newNotification);
    
    await newNotification.save();
    await sendNotification(wss, newNotification);
  } catch (error) {
    console.error('Error processing message:', error);
  }
}
