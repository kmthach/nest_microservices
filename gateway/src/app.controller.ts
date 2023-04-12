
import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginRequestDto } from './dtos/login-request.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';
import { Request } from 'express';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard)
  getCurrentUser(@Req() request: Request): string {
    
    return request['payload']
  }

  @Get('users')
  @UseGuards(AuthGuard)
  getUsers(){
    return this.appService.getUsers()
  }

  @Get('users/:id')
  @UseGuards(AuthGuard)
  getUserById(@Param('id') id: number){
    return this.appService.getUserById(id)
  }

  @Post('users')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  createUser(@Body() user: CreateUserDto){
    return this.appService.createUser(user)
  }

  @Get('tasks')
  @UseGuards(AuthGuard)
  getTasks() {
    return this.appService.getTasks()
  }
  @Get('tasks/:id')
  @UseGuards(AuthGuard)
  getTaskById(@Param('id') id: number){
    return this.appService.getTaskById(id)
  }

  @Post('tasks')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  createTask(@Body() task: CreateTaskDto){
    this.appService.createTask(task)
  }

  @UseFilters(UnauthorizedExceptionFilter)
  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() loginRequest: LoginRequestDto){
     return this.appService.login(loginRequest)

  }

  @UseFilters(UnauthorizedExceptionFilter)
  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() registerRequest: RegisterRequestDto){
    return this.appService.register(registerRequest)
  }
}
