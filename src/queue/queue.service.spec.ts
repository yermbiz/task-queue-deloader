import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bullmq';

describe('QueueService', () => {
  let service: QueueService;
  let mockQueue: Partial<Queue>;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'test-job-id' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        { provide: getQueueToken('task-queue'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should add a task to the queue', async () => {
    await service.addTask({ message: 'Test task' });

    expect(mockQueue.add).toHaveBeenCalledWith(
      'process-task',
      { message: 'Test task' },
      { attempts: 5, backoff: { type: 'exponential', delay: 10000 } },
    );
  });
});
