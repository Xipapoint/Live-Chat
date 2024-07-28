import amqp from 'amqplib';
import userService from '../service/authService';

const rabbitMQ = {
  url: 'amqp://localhost',
};

class UserConsumer {
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
          const message = JSON.parse(messageContent);
          console.log(`[x] Received message: ${messageContent}`);

          try {
            const userId = await userService.getUserByNames(message.firstName, message.lastName);

            this.channel!.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(userId),
              { correlationId: msg.properties.correlationId }
            );
          } catch (error: any) {
            console.error('Error processing message:', error.message);
          }

          this.channel?.ack(msg);
        }
      });
    } catch (error) {
      console.error('Error starting consumer', error);
    }
  }

  private async closeConnection() {
    if (this.channel) {
      await this.channel.close();
      this.channel = undefined;
    }
    if (this.connection) {
      await this.connection.close();
      this.connection = undefined;
    }
  }
}

export default new UserConsumer();
