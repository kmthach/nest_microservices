import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

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
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://root:root@localhost:5000'],
      queue: 'user_queue',
      queueOptions: {
        durable: true
      },
      
    }
  })
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, 'protos/user.proto'),
    }
  })
  await app.startAllMicroservices()
  await app.listen(3002)
}
bootstrap();
