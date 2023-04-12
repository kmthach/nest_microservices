import { Catch, RpcExceptionFilter, ArgumentsHost, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';


@Catch(UnauthorizedException)
export class UnautherizedExceptionFilter implements RpcExceptionFilter<UnauthorizedException> {
  catch(exception: UnauthorizedException, host: ArgumentsHost): Observable<any> {
    return throwError(() => exception)
  }
}