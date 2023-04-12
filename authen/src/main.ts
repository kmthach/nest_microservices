import { Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    tranport: Transport.TCP,
    options: {
      port: 3007
    }
  })
  await app.startAllMicroservices()
  await app.listen(3008);
}
bootstrap();
