
import { Body, CacheTTL, Controller, Get, Param, Post, Req, UnauthorizedException, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginRequestDto } from './dtos/login-request.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RoleGuard } from './guards/role/role.guard';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @CacheKey('123')
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

  @Post('users')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe())
  createUser(@Body() user: CreateUserDto){
    return this.appService.createUser(user)
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
  // @UseGuards(AuthGuard, RoleGuard)
  // @UsePipes(new ValidationPipe())
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
