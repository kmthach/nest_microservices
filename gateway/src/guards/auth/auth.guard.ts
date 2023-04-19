
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE')
    private authClient: ClientProxy
  ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    
    if(token){
      const pattern = 'AUTHHENTICATE_BY_TOKEN'
      try{
        const result = await this.authClient.send(pattern, {token}).toPromise()
        request['user'] = result
        return true
      }
      catch{
        throw new UnauthorizedException()
      }
    }
    else throw new UnauthorizedException()
   
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }


}
