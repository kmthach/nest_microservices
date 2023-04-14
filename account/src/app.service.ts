import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @Inject('TASK_QUEUE_SERVICE')
    private taskQueueService: ClientProxy
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
    if (user.num_tasks < 13) {
      try{
        await this.usersRepository.save(user)
        const pattern = 'UPDATE_USER'
        this.taskQueueService.emit(pattern, true)
      }
      catch {
        const pattern = 'UPDATE_USER'
        this.taskQueueService.emit(pattern, false)
      }
    }
    else {
      const pattern = 'UPDATE_USER'
      this.taskQueueService.emit(pattern, false)
    }
    
    
  }

}
