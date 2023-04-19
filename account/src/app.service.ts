import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import {Connection} from 'amqplib'

import { InjectAmqpConnection } from 'nestjs-amqp';
import { User } from './entities/user.entity';
import { UserTask } from './entities/user_task.entity';
import { CreateUserTaskDto } from './dtos/create-task.dto';
@Injectable()
export class AppService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectAmqpConnection('rabbitmq')
    private connection: Connection,
    @InjectRepository(UserTask)
    private userTaskRepository: Repository<UserTask>
  ){}

  getHello(): string{
    return 'Hello World'
  }

  async getAllUsers(): Promise<User[]>{
    return await this.usersRepository.find()
  }

  async getUserById(id: number): Promise<User>{
    return await this.usersRepository.findOneBy({id})
  }
  async createUser(user: User) {
    try{
      await this.usersRepository.save(user)
      const payload = {
        status: true
      }
      this.emitEvent(payload, 'user_queue')
    }
    catch(e) {
      const payload = {
        status: false
      }
      this.emitEvent(payload, 'user_queue')
    }
  }

  async createUserTask(createUserTaskDto: CreateUserTaskDto){

      try{
        await this.userTaskRepository.save(createUserTaskDto)
        const payload = {
          status: true
        }
        this.emitEvent(payload, 'task_queue')
      }
      catch(e) {
        const payload = {
          status: false
        }
        
        this.emitEvent(payload, 'task_queue')
      }
    
  }

  async emitEvent(payload: any, queue: string) {
    try {
 
      const channel = await this.connection.createChannel()
      await channel.assertQueue(queue)
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))

    }
    catch (e){
      console.log('Error emit event')
      throw e
      
    }
  }

}
