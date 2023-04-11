import { Inject, Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/task.dto';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task) 
    private tasksRepository: Repository<Task>,
    @Inject('TASK_QUEUE_SERVICE')
    private readonly taskQueueService: ClientProxy){}
  getHello(): string {
    return 'Hello World!';
  }

  async getAllTasks(): Promise<Task[]>{
    return this.tasksRepository.find()
  }

  async getTaskById(id: number): Promise<Task>{
    return this.tasksRepository.findOneBy({id})
  }
  async createTask(createTaskDto: CreateTaskDto){
    await this.tasksRepository.insert(createTaskDto)
    const pattern = 'TASK_CREATED'
    this.taskQueueService.emit(pattern, createTaskDto)
  }

}
