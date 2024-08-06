import amqp from 'amqplib';
import userService from '../service/authService';
import { ServiceMessage } from './types/request/requestTypes';
import handlers from './messageHandler';

const rabbitMQ = {
  url: 'amqp://localhost',
};

class Consumer {
  private channel: amqp.Channel | undefined;
  private connection: amqp.Connection | undefined;

  public async start() {
    try {
      this.connection = await amqp.connect(rabbitMQ.url);
      this.channel = await this.connection.createChannel();

      const queue = 'userQueue';
      await this.channel.assertQueue(queue, { durable: true });

      console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

      this.channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          const message: ServiceMessage = JSON.parse(messageContent);
          console.log(`[x] Received message: ${messageContent}`);
  
          try {
            const handler = handlers[message.serviceType];
            if (!handler) {
              throw new Error('Unknown service type');
            }
  
            const response = await handler.handle(message);
            this.channel!.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(JSON.stringify(response)),
              { correlationId: msg.properties.correlationId }
            );
          } catch (error: any) {
            console.error('Error processing message:', error.message);
            this.channel?.reject(msg, false)
          }
  
          this.channel?.ack(msg);
        }
      });
    } catch (error) {
      console.error('Error starting consumer', error);
    }
  }

}

export default new Consumer();
