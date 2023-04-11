import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
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
    await this.usersRepository.save(user)
  }

}
