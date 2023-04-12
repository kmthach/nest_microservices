import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entities/user-token.entity';
import { UserHashPassword } from './entities/user-password.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'constants/jwt.constant';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 8000,
      username: 'root',
      password: 'root',
      database: 'auth',
      entities: [UserToken, UserHashPassword],
      synchronize: true
    }),
    TypeOrmModule.forFeature([UserToken, UserHashPassword]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
