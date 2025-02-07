import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { QueueService } from './queue/queue.service';
import { TaskConsumer } from './queue/task.consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const queueService = app.get(QueueService);
  await TaskConsumer.consume(queueService);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  console.log('Used port:', port);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
