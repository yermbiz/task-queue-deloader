import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('task-queue') private queue: Queue) {}
  async addTask(data: any) {
    console.log('📌 Adding task to BullMQ:', data);
    await this.queue.add('process-task', data, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 10000 },
    });
    console.log('✅ Task added to queue:', data);
  }
}
