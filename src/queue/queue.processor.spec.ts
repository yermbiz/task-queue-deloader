import { QueueProcessor } from './queue.processor';
import { Job } from 'bullmq';

describe('QueueProcessor', () => {
  let processor: QueueProcessor;

  beforeEach(() => {
    processor = new QueueProcessor();
  });

  it('should increment the completedJobsCounter when a task is processed', async () => {
    const incSpy = jest.spyOn(QueueProcessor['completedJobsCounter'], 'inc');

    const job: Partial<Job> = { id: 'test-job', data: { message: 'Hello' } };

    await processor.handleTask(job as Job);

    expect(incSpy).toHaveBeenCalledTimes(1);
  });
});
