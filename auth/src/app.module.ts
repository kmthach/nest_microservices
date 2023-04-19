
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { AmqpModule } from 'nestjs-amqp';
import { MongooseModule } from '@nestjs/mongoose';
import {UserHashPassword, UserHashPasswordSchema } from './schemas/user-password.schema';
import { UserToken, UserTokenSchema } from './schemas/user-token.schema';
import { UserRole, UserRoleSchema } from './schemas/user-role.schema';


@Module({
  imports: [
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
    MongooseModule.forRoot(
      'mongodb://localhost:1111',
      {
        // user: 'rootUser',
        // pass: 'rootPass',
        dbName: 'auth',
        directConnection:true,
        replicaSet: 'rs0',
        autoCreate: true
      }),
    MongooseModule.forFeature([
      { name: UserHashPassword.name, schema: UserHashPasswordSchema },
      { name: UserToken.name, schema: UserTokenSchema },
      { name: UserRole.name, schema: UserRoleSchema },
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
