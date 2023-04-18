import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, EventPattern, ClientProxy } from '@nestjs/microservices';
import { Task } from './entities/task.entity';
import { CreateTaskDto, GetTaskDto } from './dtos/task.dto';
import { QueryRunner } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService) {}


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('GET_TASKS')
  async getTasks(): Promise<GetTaskDto[]> {
    console.log('Handle Get Task Message')
    return this.appService.getAllTasks()
  }

  @MessagePattern('GET_TASK_BY_ID')
  async getTaskById(data: {id: number}): Promise<GetTaskDto> {
    console.log('Handle Get Task By Id Message')
    return this.appService.getTaskById(data.id)
  }

  @EventPattern('CREATE_TASK')
  async createTasks(data: CreateTaskDto) {
    console.log('Handle create task Event')
    await this.appService.createTask(data)
  }


}
