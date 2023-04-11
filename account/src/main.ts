import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port:3000
    }
  })
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://root:root@localhost:5000'],
      queue: 'task_queue',
      queueOptions: {
        durable: true
      },
      
    }
  })
  await app.startAllMicroservices()
  await app.listen(3002)
}
bootstrap();
