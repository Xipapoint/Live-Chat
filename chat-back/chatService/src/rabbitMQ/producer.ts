import amqp from 'amqplib';
import { ServiceMessage } from './types/request/requestTypes';
import { addQueueToMessage } from './types/request/QueueTypes';


const rabbitMQ = {
  url: 'amqp://localhost',
};

class Producer {
  private channel: amqp.Channel | undefined;
  private connection: amqp.Connection | undefined;

  public async publishMessage<T>(message: ServiceMessage): Promise<T> {
    if (!this.connection) {
      this.connection = await amqp.connect(rabbitMQ.url);
    }
    if (!this.channel) {
      this.channel = await this.connection.createChannel();
    }

    const messageWithQueue = addQueueToMessage(message)
    const queue = messageWithQueue.queue
    await this.channel.assertQueue(queue, { durable: true });

    const correlationId = this.generateUuid();
    const replyQueue = await this.channel.assertQueue('', { exclusive: true });

    const response = new Promise<T>((resolve, reject) => {
      this.channel!.consume(replyQueue.queue, (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          resolve(JSON.parse(msg.content.toString()));
        }
      }, { noAck: true });

      this.channel!.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        correlationId: correlationId,
        replyTo: replyQueue.queue
      });
    });

    return response;
  }

  private generateUuid() {
    return crypto.randomUUID();
  }
}

export default new Producer();