import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserHashPassword } from './entities/user-password.entity';
import { UserToken } from './entities/user-token.entity';
import { AuthByTokenRequestDto } from './dtos/auth-request.dto';
import { Repository } from 'typeorm';
import { RegisterRequestDto } from './dtos/register-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'constants/jwt.constant';
import { LoginRequestDto } from './dtos/login-request.dto';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserHashPassword) private userHashPassword: Repository<UserHashPassword>,
    @InjectRepository(UserToken) private userToken: Repository<UserToken>,
    private jwtService: JwtService
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async register(data: RegisterRequestDto): Promise<any>{
    const saltOrRounds = 10
    const hashpassword = await bcrypt.hash(data.password, saltOrRounds)
    const userHashPassword = new UserHashPassword()
    userHashPassword.hashpassword = hashpassword
    userHashPassword.username = data.username
    await this.userHashPassword.insert(userHashPassword)
    const payload = {
      username: data.username
    }
    return await this.jwtService.signAsync(payload)
  }


  async login(request: LoginRequestDto): Promise<string>{
    const user = await this.userHashPassword.findOneBy({username: request.username})
    if (user){
      const result =  await bcrypt.compare(request.password, user.hashpassword)
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
      return payload
    }
    catch {
      throw new UnauthorizedException()
    }
    
  }



}
