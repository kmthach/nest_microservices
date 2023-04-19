import { Connection, ConsumeMessage } from 'amqplib';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthByTokenRequestDto } from './dtos/auth-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { LoginRequestDto } from './dtos/login-request.dto';
import { Role } from './enums/role.enum';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { Channel } from 'amqp-connection-manager';
import { ClientProxy } from '@nestjs/microservices';
import { UserHashPassword } from './schemas/user-password.schema';
import {  InjectConnection, InjectModel } from '@nestjs/mongoose';
import  mongoose, { Model, mongo } from 'mongoose';
import { UserToken } from './schemas/user-token.schema';
import { UserRole } from './schemas/user-role.schema';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    @InjectAmqpConnection('rabbitmq') 
    private connection: Connection,
    @Inject('USER_QUEUE_SERVICE') 
    private userQueueService: ClientProxy,
    @InjectConnection() private readonly mgConnection: mongoose.Connection,
    @InjectModel(UserHashPassword.name) private userHashPasswordModel: Model<UserHashPassword>,
    @InjectModel(UserToken.name) private userTokenModel: Model<UserToken>,
    @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async register(userHashPassword: UserHashPassword): Promise<any>{
    const saltOrRounds = 10
    const hashpassword = await bcrypt.hash(userHashPassword.password, saltOrRounds)
    userHashPassword.password = hashpassword
   
    const session = await this.mgConnection.startSession()
    session.startTransaction();
    try{
      const newUser = new this.userHashPasswordModel(userHashPassword)

      const defaultUserRole = new UserRole()
      defaultUserRole.role = Role.User
      defaultUserRole.username = userHashPassword.username

      const newUserRole = new this.userRoleModel(defaultUserRole)
      await this.userHashPasswordModel.create([newUser], {session: session})
      await this.userRoleModel.create([newUserRole], {session: session})

      const pattern = 'NEW_USER_CREATED'
      const channel = await this.connection.createChannel()
      await channel.assertQueue('user_queue')

      let result: any
      const consumer = (channel: Channel) => async (msg: ConsumeMessage | null): Promise<any> => {
        if (msg) {
          channel.ack(msg)
          const json_msg = JSON.parse(msg.content.toString())
          if (json_msg.status){
            await session.commitTransaction()
            await channel.close()
            result = json_msg
            console.log(json_msg)
            console.log('Transaction commited')
          }
          else if(json_msg.status !== undefined){
            await session.abortTransaction()
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
            await session.abortTransaction()
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
    catch (e){
      await session.abortTransaction()
      throw e
    }
    
  }


  async login(request: LoginRequestDto): Promise<string>{
    const user = await this.userHashPasswordModel.findOne({username: request.username})
    if (user){
      const result =  await bcrypt.compare(request.password, user.password)
      if(result){
        const payload = {
          username: request.username
        }
        const token =  await this.jwtService.signAsync(payload)
        const data = this.jwtService.decode(token)

        const userToken = new this.userTokenModel()
        userToken.token = token
        userToken.username = request.username
        userToken.expireDate = data['exp']
        await userToken.save()
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
    const user = await this.userRoleModel.findOne({username: username})
    return user.role
  }



}
