import * as amqp from 'amqplib';
import { QueueService } from './queue.service';

export class TaskConsumer {
  private static connection: amqp.Connection;
  private static channel: amqp.Channel;
  private static readonly queue = 'task-queue';

  static async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
    }
  }

  static async consume(queueService: QueueService) {
    await this.connect();
    this.channel.consume(this.queue, async (msg) => {
      if (msg) {
        const task = JSON.parse(msg.content.toString());
        console.log(`📩 Received task from RabbitMQ:`, task);
        try {
          console.log(`🔄 Forwarding task to BullMQ...`);
          await queueService.addTask(task);
          console.log(`✅ Successfully added task to BullMQ`);
        } catch (error) {
          console.error(`❌ Failed to add task to BullMQ:`, error);
        }
        this.channel.ack(msg);
      }
    });
    console.log('🚀 Listening for tasks in RabbitMQ...');
  }
}
