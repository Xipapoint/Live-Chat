import amqp from "amqplib"
const rabbitMQ = {
  url: 'amqp://localhost',
};

class Producer {
  protected userChannel: amqp.Channel | undefined;
  protected notificationChannel: amqp.Channel | undefined;
  protected connection: amqp.Connection | undefined;

  public async publishMessage(dataMessage: Record<string, string> | string) {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect(rabbitMQ.url);
      }
      if (!this.userChannel) {
        this.userChannel = await this.connection.createChannel();
      }
      if (!this.notificationChannel) {
        this.notificationChannel = await this.connection.createChannel();
      }

      const messageType = this.determineMessageType(dataMessage as Record<string, string>);
      const message = {
        typeMessage: messageType,
        data: dataMessage
      };

      await this.userChannel.assertQueue('userQueue', { durable: true });
      await this.notificationChannel.assertQueue('notificationQueue', { durable: true });

      if (messageType === 'user') {
        this.userChannel.sendToQueue('userQueue', Buffer.from(JSON.stringify(message)));
      } else if (messageType === 'notification') {
        this.notificationChannel.sendToQueue('notificationQueue', Buffer.from(JSON.stringify(message)));
      } else {
        throw new Error('Unknown message type');
      }
    } catch (error) {
      console.error('Error publishing message', error);
    }
  }

  private determineMessageType(dataMessage: Record<string, string>): string {
    if (dataMessage.hasOwnProperty('firstName') && dataMessage.hasOwnProperty('lastName')) {
      return 'user';
    } 
    // Добавьте дополнительные условия для других типов сообщений
    return 'notification'; // По умолчанию
  }
}

export default new Producer();
