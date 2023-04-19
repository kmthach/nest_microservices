
import { Body, CacheTTL, Controller, Get, Param, Post, Req, UnauthorizedException, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';

import { CreateTaskDto } from './dtos/create-task.dto';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginRequestDto } from './dtos/login-request.dto';

import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RoleGuard } from './guards/role/role.guard';
import { RegisterDto } from './dtos/register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(){
    return this.appService.getHello()
  }

  @UseFilters(UnauthorizedExceptionFilter)
  @Get('profile')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User, Role.Admin)
  getCurrentUser(@Req() request: Request): string {
    return request['user']
  }

  @UseFilters(UnauthorizedExceptionFilter)
  @Get('users')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  getUsers(){
    return this.appService.getUsers()
  }

  @Get('users/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  getUserById(@Param('id') id: number){
    return this.appService.getUserById(id)
  }



  @Get('tasks')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  getTasks() {
    return this.appService.getTasks()
  }

  @Get('tasks/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  getTaskById(@Param('id') id: number){
    return this.appService.getTaskById(id)
  }

  @Post('tasks')
  @UseGuards(AuthGuard, RoleGuard)
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

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() registerDto: RegisterDto){
    console.log('handle register')
    return this.appService.register(registerDto)
  }
}
