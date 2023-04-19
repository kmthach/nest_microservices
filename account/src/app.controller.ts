import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, GetUserDto, UserById } from './dtos/user.dto';
import { CreateUserTaskDto } from './dtos/create-task.dto';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';


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
  
  @EventPattern('NEW_USER_CREATED')
  createUser(data: CreateUserDto){
    console.log('handle createuser event ')
    this.appService.createUser(data)
  }

  @EventPattern('TASK_CREATED')
  createUserTask(@Payload() data: CreateUserTaskDto){
    console.log('Handle task created event from rmq')
    return this.appService.createUserTask(data)
  }

  @GrpcMethod('UsersService', 'FindOne')
  async findOne(data: UserById, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<GetUserDto> {
    return await this.appService.getUserById(data.id)
  }

  
}
