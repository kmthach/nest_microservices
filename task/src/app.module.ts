import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AmqpModule } from 'nestjs-amqp';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 6000,
      username:'root',
      password:'root',
      entities: [Task],
      database: 'task',
      synchronize: true
    }), 
    TypeOrmModule.forFeature([Task]),
    ClientsModule.register([
      {
        name: 'TASK_QUEUE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://root:root@localhost:5000'],
          queue: 'task_queue',
          queueOptions: {
            durable: true
          }
        }
      }
    ]),
    AmqpModule.forRoot({
      name: 'rabbitmq',
      hostname: 'localhost',
      port: 5000,
      username: 'root',
      password: 'root',
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
