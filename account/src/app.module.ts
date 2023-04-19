
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { AmqpModule } from 'nestjs-amqp';
import { UserTask } from './entities/user_task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 4000,
      username: 'root',
      password: 'root',
      database: 'user',
      entities: [User, UserTask],
      synchronize: true
    }), 
    TypeOrmModule.forFeature([User, UserTask]),
    AmqpModule.forRoot({
      name: 'rabbitmq',
      hostname: 'localhost',
      port: 5000,
      username: 'root',
      password: 'root',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
