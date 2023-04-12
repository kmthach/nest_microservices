import { TaskCreateEvent } from './events/task-create.event';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserEntity } from './entities/user.entity';
import { Observable } from 'rxjs';
import { UserCreateEvent } from './events/user-create.event';
import { CreateUserDto } from './dtos/create-user.dto';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginEvent } from './events/login.events';

import { RegisterEvent } from './events/register.events';
import { RegisterRequestDto } from './dtos/register-request.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('ACCOUNT_SERVICE') private account_client: ClientProxy,
    @Inject('TASK_SERVICE') private task_client: ClientProxy,
    @Inject('AUTH_SERVICE') private auth_client: ClientProxy,
  ){}

  getHello(): string {
    return 'Hello World!';
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

  createUser(createUserDto: CreateUserDto) {
    const pattern = 'CREATE_USER'
    const userCreateEvent = new UserCreateEvent()

    userCreateEvent.username = createUserDto.username
    userCreateEvent.password = createUserDto.password
    userCreateEvent.num_tasks = createUserDto.num_tasks
    this.account_client.emit<any>(pattern, userCreateEvent)
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

  createTask(createTaskDto: CreateTaskDto){
    const pattern = 'CREATE_TASK'
    const taskCreateEvent = new TaskCreateEvent()
    taskCreateEvent.detail = createTaskDto.detail
    taskCreateEvent.title = createTaskDto.title
    taskCreateEvent.user_id = createTaskDto.user_id

    this.task_client.emit<any>(pattern, taskCreateEvent)
  }

  async login(loginRequestDto: LoginRequestDto){
    const pattern = 'LOGIN'
    const loginEvent = new LoginEvent()
    loginEvent.username = loginRequestDto.username
    loginEvent.password = loginRequestDto.password
  
    try{
      const result = await this.auth_client.send(pattern, loginEvent).toPromise()
      return result
    }
    catch {
      throw new UnauthorizedException()
    }
  }

  async register(registerRequestDto: RegisterRequestDto){
    const pattern = 'REGISTER'
    const registerEvent = new RegisterEvent()
    registerEvent.username = registerRequestDto.username
    registerEvent.password = registerRequestDto.password
    try{
      const result = await this.auth_client.send(pattern, registerEvent).toPromise()
      return result
    }
    catch {
      throw new UnauthorizedException()
    }
  }
}
