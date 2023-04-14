import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 4000,
    username: 'root',
    password: 'root',
    database: 'user',
    entities: [UserEntity],
    synchronize: true
  }), TypeOrmModule.forFeature([UserEntity]),
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
  ])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
