import { Inject, Injectable, HttpException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/task.dto';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task) 
    private tasksRepository: Repository<Task>,
    @Inject('TASK_QUEUE_SERVICE')
    private readonly taskQueueService: ClientProxy,
    private readonly dataSource: DataSource

  ){}
  getHello(): string {
    return 'Hello World!';
  }

  async getAllTasks(): Promise<Task[]>{
    return this.tasksRepository.find()
  }

  async getTaskById(id: number): Promise<Task>{
    return this.tasksRepository.findOneBy({id})
  }
  async createTask(newTask: Task){
    // await this.tasksRepository.insert(createTaskDto)

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      console.log(newTask)
      await queryRunner.manager.insert(Task, newTask)
      const pattern = 'TASK_CREATED'
      await this.taskQueueService.emit(pattern, newTask).toPromise()
      
      return queryRunner
    }
    catch {
      queryRunner.rollbackTransaction()
    }
  }
  async approveChange(queryRunner: QueryRunner){
    console.log('approve change')
    await queryRunner.commitTransaction()
    await queryRunner.release()
  }

  async rejectChange(queryRunner: QueryRunner){
    console.log('reject change')
    await queryRunner.rollbackTransaction()
    await queryRunner.release()
  }
}
