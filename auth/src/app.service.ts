import { Connection, ConsumeMessage } from 'amqplib';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserHashPassword } from './entities/user-password.entity';
import { UserToken } from './entities/user-token.entity';
import { AuthByTokenRequestDto } from './dtos/auth-request.dto';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { RegisterRequestDto } from './dtos/register-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { LoginRequestDto } from './dtos/login-request.dto';
import { Role } from './enums/role.enum';
import { UserRole } from './entities/user-role.entity';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { Channel } from 'amqp-connection-manager';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserHashPassword) private userHashPassword: Repository<UserHashPassword>,
    @InjectRepository(UserToken) private userToken: Repository<UserToken>,
    @InjectRepository(UserRole) private userRole: Repository<UserRole>,
    private jwtService: JwtService,
    private readonly dataSource: DataSource,
    @InjectAmqpConnection('rabbitmq') 
    private connection: Connection,
    @Inject('USER_QUEUE_SERVICE') 
    private userQueueService: ClientProxy
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async register(userHashPassword: UserHashPassword): Promise<any>{
    const saltOrRounds = 10
    const hashpassword = await bcrypt.hash(userHashPassword.password, saltOrRounds)
    userHashPassword.password = hashpassword

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try{
      const maxId = await queryRunner.manager.maximum(UserHashPassword, "id")
      userHashPassword.id = maxId + 1
      await queryRunner.manager.save(UserHashPassword, userHashPassword)
      const pattern = 'NEW_USER_CREATED'

      const channel = await this.connection.createChannel()
      await channel.assertQueue('user_queue')

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

      await channel.consume('user_queue', consumer(channel))
      await this.userQueueService.emit(pattern, userHashPassword).toPromise()
      const waiting = new Promise((resolve) => {
        setTimeout(async () => {
          if (!result) {
            console.log('Transaction not done yet')
            await queryRunner.rollbackTransaction()
            console.log('Transaction rollbacked')
            resolve('Fail to create new account')
          }
          else {
            console.log('Transaction already done')
            resolve('Success')
          }
        }
        ,5000)
      })
      return await waiting
    }
    catch {
      await queryRunner.rollbackTransaction()
    }
    
    
  }


  async login(request: LoginRequestDto): Promise<string>{
    const user = await this.userHashPassword.findOneBy({username: request.username})
    if (user){
      const result =  await bcrypt.compare(request.password, user.password)
      if(result){
        const payload = {
          username: request.username
        }
        const token =  await this.jwtService.signAsync(payload)
        const data = this.jwtService.decode(token)

        const userToken = new UserToken()
        userToken.token = token
        userToken.username = request.username
        userToken.expireDate = data['exp']
        await this.userToken.insert(userToken)
        return token
      }
      else {
        throw new UnauthorizedException()
      }
      
    }
    else {
      throw new UnauthorizedException()
    }
  }

  async authenByToken(request: AuthByTokenRequestDto): Promise<any>{
    try {
      const payload = await this.jwtService.verifyAsync(
        request.token,
        {
          secret: jwtConstants.secret
        }
      )
      const role: Role = await this.getRole(payload.username)
      const data = {
        username: payload.username,
        role: role
      }
      return data
    }
    catch {
      throw new UnauthorizedException()
    }
    
  }

  private async getRole(username: string): Promise<Role>{
    const user = await this.userRole.findOneBy({username: username})
    return user.role

  }



}
