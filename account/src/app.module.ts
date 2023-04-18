import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AmqpModule } from 'nestjs-amqp';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 4000,
      username: 'root',
      password: 'root',
      database: 'user',
      entities: [UserEntity],
      synchronize: true
    }), 
    TypeOrmModule.forFeature([UserEntity]),
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
