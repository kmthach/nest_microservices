import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entities/user-token.entity';
import { UserHashPassword } from './entities/user-password.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { UserRole } from './entities/user-role.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AmqpModule } from 'nestjs-amqp';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 8000,
      username: 'root',
      password: 'root',
      database: 'auth',
      entities: [UserToken, UserHashPassword, UserRole],
      synchronize: true
    }),
    TypeOrmModule.forFeature([UserToken, UserHashPassword, UserRole]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    ClientsModule.register([
      {
        name: 'USER_QUEUE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://root:root@localhost:5000'],
          queue: 'user_queue',
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
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
