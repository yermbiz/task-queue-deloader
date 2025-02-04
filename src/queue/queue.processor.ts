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
  private static completedJobsCounter = new client.Counter({
    name: 'completed_jobs_total',
    help: 'Total number of completed jobs',
  });

  constructor() {
    client.register.registerMetric(QueueProcessor.completedJobsCounter);
    console.log('✅ QueueProcessor has started and is ready to process jobs.');
  }

  @Process('process-task')
  async handleTask(job: Job) {
    try {
      logger.info(`Processing task ${job.id}: ${JSON.stringify(job.data)}`);
      await new Promise((res) => setTimeout(res, 2000));
      QueueProcessor.completedJobsCounter.inc();
      logger.info(`Task ${job.id} completed`);
    } catch (error) {
      logger.error(`Task ${job.id} failed: ${error.message}`);
    }
  }
}
