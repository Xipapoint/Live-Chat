import amqp from 'amqplib';

import { ServiceMessage } from './types/request';
import { WebSocketServer, WebSocket } from 'ws';
import { server } from '..';
import { handleConnection } from '../ws/connectionHandler';
import { SetNotificationUserMessageRequestMessage } from './types/request/notification/NotificationMessage.types';
import http from 'http';
import { createNotification } from '../ws/wsMessageHandler';

const rabbitMQ = {
  url: 'amqp://localhost',
};

class Consumer {
  private channel: amqp.Channel | undefined;
  private connection: amqp.Connection | undefined;

  public async start(wss: WebSocketServer, ws: WebSocket, req: http.IncomingMessage) {
    try {
      this.connection = await amqp.connect(rabbitMQ.url);
      this.channel = await this.connection.createChannel();

      const queue = 'notificationQueue';
      await this.channel.assertQueue(queue, { durable: true });

      console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

      this.channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          const message: SetNotificationUserMessageRequestMessage = JSON.parse(messageContent);
          console.log(`[x] Received message: ${messageContent}`);
          try {
            await createNotification(wss, ws, message)
          } catch (error: any) {
            console.error('Error processing message:', error.message);
            this.channel!.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(JSON.stringify(error)),
              { correlationId: msg.properties.correlationId }
            );
            this.channel?.reject(msg, false)
          }
        }
      });
    } catch (error) {
      console.error('Error starting consumer', error);
    }
  }

}

export default new Consumer();


            // const handler = handlers[message.serviceType];
            // if (!handler) {
            //   throw new Error('Unknown service type');
            // }
            // this.channel!.sendToQueue(
            //   msg.properties.replyTo,
            //   Buffer.from(JSON.stringify(response)),
            //   { correlationId: msg.properties.correlationId }
            // );