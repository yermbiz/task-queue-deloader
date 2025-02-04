import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import pino from 'pino';
import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

@Processor('task-queue')
@Injectable()
export class QueueProcessor {
  private static completedJobsCounter: client.Counter;

  constructor() {
    this.initMetrics();
    logger.info('✅ QueueProcessor has started and is ready to process jobs.');
  }

  private initMetrics() {
    if (!QueueProcessor.completedJobsCounter) {
      QueueProcessor.completedJobsCounter = new client.Counter({
        name: 'completed_jobs_total',
        help: 'Total number of completed jobs',
      });
      client.register.registerMetric(QueueProcessor.completedJobsCounter);
    }
  }

  @Process('process-task')
  async handleTask(job: Job) {
    const taskId = job.id;
    try {
      logger.info({ taskId, data: job.data }, 'Processing task');

      await new Promise((resolve) => setImmediate(resolve)); // Simulate async work

      QueueProcessor.completedJobsCounter.inc();
      logger.info({ taskId }, '✅ Task completed');
    } catch (error) {
      logger.error({ taskId, error: error.message }, '❌ Task failed');
    }
  }
}
