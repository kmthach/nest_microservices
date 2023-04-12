import { Controller, Get, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthByTokenRequestDto } from './dtos/auth-request.dto';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { LoginRequestDto } from './dtos/login-request.dto';
import { UnautherizedExceptionFilter } from './filters/validation-exception.filter';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('AUTHHENTICATE_BY_TOKEN')
  @UsePipes(new ValidationPipe())
  async authenByToken(data: AuthByTokenRequestDto): Promise<any> {
    return await this.appService.authenByToken(data)
  }

  @MessagePattern('LOGIN')
  @UsePipes(new ValidationPipe())
  @UseFilters(UnautherizedExceptionFilter)
  async login(data: LoginRequestDto): Promise<any> {
    return await this.appService.login(data)
  }

  @MessagePattern('REGISTER')
  @UsePipes(new ValidationPipe())
  @UseFilters(UnautherizedExceptionFilter)
  async register(data: RegisterRequestDto): Promise<boolean>{
    return await this.appService.register(data)
  }

}
