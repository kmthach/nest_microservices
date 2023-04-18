import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import {Connection} from 'amqplib'

import { InjectAmqpConnection } from 'nestjs-amqp';
@Injectable()
export class AppService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectAmqpConnection('rabbitmq')
    private connection: Connection
  ){}

  getHello(): string{
    return 'Hello World'
  }

  async getAllUsers(): Promise<UserEntity[]>{
    return await this.usersRepository.find()
  }

  async getUserById(id: number): Promise<UserEntity>{
    return await this.usersRepository.findOneBy({id})
  }
  async createUser(user: UserEntity) {
    return this.usersRepository.insert(user)
  }

  async updateUserById(id: number){
    const user = await this.usersRepository.findOneBy({id})
    user.num_tasks+=1
    if (user.num_tasks < 21) {
      try{
        await this.usersRepository.save(user)
        const payload = {
          status: true
        }
        
        this.emitEvent(payload, 'task_queue')
      }
      catch {
        const payload = {
          status: false
        }
        
        this.emitEvent(payload, 'task_queue')
      }
    }
    else {
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
