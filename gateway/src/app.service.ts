import { TaskCreateEvent } from './events/task-create.event';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserEntity } from './entities/user.entity';
import { Observable, firstValueFrom } from 'rxjs';
import { UserCreateEvent } from './events/user-create.event';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginEvent } from './events/login.events';

import { RegisterEvent } from './events/register.events';



@Injectable()
export class AppService {
  constructor(
    @Inject('ACCOUNT_SERVICE') private account_client: ClientProxy,
    @Inject('TASK_SERVICE') private task_client: ClientProxy,
    @Inject('AUTH_SERVICE') private auth_client: ClientProxy,

  ){}
  


  getHello(): string {
    return 'Hello'
  }

  getUsers(): Observable<UserEntity[]>{
    const pattern = 'GET_ALL_ACCOUNTS'
    const payload = []
    return this.account_client.send<UserEntity[]>(pattern, payload)
  }

  getUserById(id: number): Observable<UserEntity>{
    const pattern = 'GET_ACCOUNT_BY_ID'
    const payload = {id: id}
    return this.account_client.send<UserEntity>(pattern, payload)
  }

  createUser(createUserEvent: UserCreateEvent) {
    const pattern = 'CREATE_USER'


    this.account_client.emit<any>(pattern, createUserEvent)
  }

  getTasks(): Observable<Task> {
    const pattern = 'GET_TASKS'
    const data = {}
    return this.task_client.send(pattern, data)
  }
  getTaskById(id: number): Observable<Task>{
    const pattern = 'GET_TASK_BY_ID'
    const payload = {id: id}
    return this.task_client.send<Task>(pattern, payload)
  }

  createTask(taskCreateEvent: TaskCreateEvent){
    const pattern = 'CREATE_TASK'
    this.task_client.emit<any>(pattern, taskCreateEvent)
  }

  async login(loginEvent: LoginEvent){
    const pattern = 'LOGIN'

  
    try{
      const result = await this.auth_client.send(pattern, loginEvent).toPromise()
      return result
    }
    catch {
      throw new UnauthorizedException()
    }
  }

  async register(registerEvent: RegisterEvent){
    const pattern = 'REGISTER'
    try{
      const result = await firstValueFrom(this.auth_client.send(pattern, registerEvent))
      return result
    }
    catch {
      throw new UnauthorizedException()
    }
  }
}
