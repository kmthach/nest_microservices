import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, GetUserDto } from './dtos/user.dto';
import { CreateTaskDto } from './dtos/create-task.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async get(): Promise<GetUserDto[]>{
    return await this.appService.getAllUsers()
  }

  @MessagePattern('GET_ALL_ACCOUNTS')
  async getAll(): Promise<GetUserDto[]>{
    return await this.appService.getAllUsers()
  }

  @MessagePattern('GET_ACCOUNT_BY_ID')
  async getAccountById(data: {id: number}): Promise<GetUserDto>{
    console.log('handle get by id message')
    return await this.appService.getUserById(data.id)
  }
  
  @EventPattern('CREATE_USER')
  createUser(data: CreateUserDto){
    console.log('handle createuser event ')
    this.appService.createUser(data)
  }

  @EventPattern('TASK_CREATED')
  updateUser(@Payload() data: CreateTaskDto){
    console.log('Handle task created event from rmq')
    return this.appService.updateUserById(data.user_id)
  }


  
}
