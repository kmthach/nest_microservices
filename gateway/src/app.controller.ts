import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateTaskDto } from './dtos/create-task.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  getUsers(){
    return this.appService.getUsers()
  }

  @Get('users/:id')
  getUserById(@Param('id') id: number){
    return this.appService.getUserById(id)
  }

  @Post('users')
  @UsePipes(new ValidationPipe())
  createUser(@Body() user: CreateUserDto){
    return this.appService.createUser(user)
  }

  @Get('tasks')
  getTasks() {
    return this.appService.getTasks()
  }
  @Get('tasks/:id')
  getTaskById(@Param('id') id: number){
    return this.appService.getTaskById(id)
  }

  @Post('tasks')
  @UsePipes(new ValidationPipe())
  createTask(@Body() task: CreateTaskDto){
    this.appService.createTask(task)
  }

  
}
