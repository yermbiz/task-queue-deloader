import { Injectable, OnModuleInit } from '@nestjs/common';
import { QueueService } from './queue/queue.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly queueService: QueueService) {}

  async onModuleInit() {
    console.log('🚀 AppService initialized, adding a test job...');
    await this.queueService.addTask({ message: 'Test job from AppService' });
  }
}
