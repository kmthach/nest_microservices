import { Global, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheConfigService } from './services/cache-config.service';


@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({ttl: 5000}),
        useClass: CacheConfigService
      })
    }),
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
      },
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
