import * as amqp from 'amqplib';

export class TaskProducer {
  private static connection: amqp.Connection;
  private static channel: amqp.Channel;
  private static readonly queue = 'retry-task-queue';

  static async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
    }
  }

  static async sendTask(task: any) {
    await this.connect();
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(task)), {
      persistent: true,
    });
    console.log(`✅ Task sent to RabbitMQ:`, task);
  }
}
