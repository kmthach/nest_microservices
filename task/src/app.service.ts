import { Inject, Injectable, HttpException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { ClientProxy } from '@nestjs/microservices';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { Connection, ConsumeMessage } from 'amqplib';
import { Channel } from 'amqp-connection-manager';


@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task) 
    private tasksRepository: Repository<Task>,
    @Inject('TASK_QUEUE_SERVICE')
    private readonly taskQueueService: ClientProxy,
    private readonly dataSource: DataSource,
    @InjectAmqpConnection('rabbitmq') 
    private connection: Connection
  ){}
  getHello(): string {
    return 'Hello World!';
  }

  async getAllTasks(): Promise<Task[]>{
    return this.tasksRepository.find()
  }

  async getTaskById(taskId: number): Promise<Task>{
    return this.tasksRepository.findOneBy({taskId})
  }
  async createTask(newTask: CreateTaskDto){
    // await this.tasksRepository.insert(createTaskDto)

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      const maxId = await queryRunner.manager.maximum(Task, "taskId")
      newTask.taskId = maxId + 1
      await queryRunner.manager.insert(Task, newTask)
      const pattern = 'TASK_CREATED'

      const channel = await this.connection.createChannel()
      await channel.assertQueue('task_queue')

      let result: any
      const consumer = (channel: Channel) => async (msg: ConsumeMessage | null): Promise<any> => {
        if (msg) {
          channel.ack(msg)
          const json_msg = JSON.parse(msg.content.toString())
          if (json_msg.status){
            await queryRunner.commitTransaction()
            await channel.close()
            result = json_msg
            console.log(json_msg)
            console.log('Transaction commited')
          }
          else if(json_msg.status !== undefined){
            await queryRunner.rollbackTransaction()
            await channel.close()
            result = true
            console.log('Transaction rollbacked')
          }
          
        }
      }

      await channel.consume('task_queue', consumer(channel))
      await this.taskQueueService.emit(pattern, newTask).toPromise()
      setTimeout(async () => {
        if (!result) {
          console.log('Transaction not done yet')
          await queryRunner.rollbackTransaction()
          
          console.log('Transaction rollbacked')
        }
        else {
          console.log('Transaction already done')
        }
      }

      ,5000)
      
    }
    catch {
      await queryRunner.rollbackTransaction()
    }
  }



  
}
