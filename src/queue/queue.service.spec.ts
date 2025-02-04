import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: 'task-queue' })],
      providers: [QueueService],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should add a task', async () => {
    const spy = jest.spyOn(service, 'addTask');
    await service.addTask({ message: 'Hello' });
    expect(spy).toHaveBeenCalledWith({ message: 'Hello' });
  });
});
