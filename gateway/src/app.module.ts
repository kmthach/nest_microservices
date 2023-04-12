import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [

    ClientsModule.register([
      {
        name: 'ACCOUNT_SERVICE', 
        transport: Transport.TCP,
        options: {
          port: 3000
        }
      },
      {
        name: 'TASK_SERVICE', 
        transport: Transport.TCP,
        options: {
          port: 3001
        }
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3007
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
