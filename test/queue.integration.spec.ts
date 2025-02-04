import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from '../src/queue/queue.service';
import { QueueProcessor } from '../src/queue/queue.processor';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bullmq';

describe('QueueService & QueueProcessor Integration', () => {
  let queueService: QueueService;
  let queueProcessor: QueueProcessor;
  let mockQueue: Partial<Queue>;

  beforeEach(async () => {
    // Mock Queue instance
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'test-job-id' }),
      getJobCounts: jest
        .fn()
        .mockResolvedValue({ waiting: 1, active: 0, completed: 0 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        QueueProcessor,
        { provide: getQueueToken('task-queue'), useValue: mockQueue },
      ],
    }).compile();

    queueService = module.get<QueueService>(QueueService);
    queueProcessor = module.get<QueueProcessor>(QueueProcessor);
  });

  it('should add a task and process it', async () => {
    // Spy on the Prometheus counter
    const incSpy = jest.spyOn(QueueProcessor['completedJobsCounter'], 'inc');

    // Step 1: Add a job
    await queueService.addTask({ message: 'Test integration' });

    // Verify the job was added to the queue
    expect(mockQueue.add).toHaveBeenCalledWith(
      'process-task',
      { message: 'Test integration' },
      { attempts: 5, backoff: { type: 'exponential', delay: 10000 } },
    );

    // Step 2: Process the job
    const job = { id: 'test-job-id', data: { message: 'Test integration' } };
    await queueProcessor.handleTask(job as any);

    // Verify the job was processed
    expect(incSpy).toHaveBeenCalledTimes(1);
  });
});
