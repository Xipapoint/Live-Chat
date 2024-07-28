import amqp from 'amqplib';

const rabbitMQ = {
  url: 'amqp://localhost',
};

class UserProducer {
  private channel: amqp.Channel | undefined;
  private connection: amqp.Connection | undefined;

  public async publishMessage(data: { firstName: string, lastName: string }): Promise<string> {
    if (!this.connection) {
      this.connection = await amqp.connect(rabbitMQ.url);
    }
    if (!this.channel) {
      this.channel = await this.connection.createChannel();
    }

    const queue = 'userQueue';
    await this.channel.assertQueue(queue, { durable: true });

    const correlationId = this.generateUuid();
    const replyQueue = await this.channel.assertQueue('', { exclusive: true });

    const response = new Promise<string>((resolve, reject) => {
      this.channel!.consume(replyQueue.queue, (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          resolve(msg.content.toString());
        }
      }, { noAck: true });

      this.channel!.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
        correlationId: correlationId,
        replyTo: replyQueue.queue
      });
    });

    return response;
  }

  private generateUuid() {
    return crypto.randomUUID();
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

export default new UserProducer();
