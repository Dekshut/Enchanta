import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      let headers;
      const request = context.switchToHttp().getRequest();

      request.rawHeaders.map((e) => {
        if (e.includes('Bearer')) {
          headers = e;
        }
      });

      if (!headers && request.url.includes('/api/story/feedback')) {
        request.user = 'Unregistered';
        return request;
      } else if (headers) {
        const token = headers.split(' ')[1];
        const validate: any = jwt.verify(token, 'secret');
        if (validate) {
          request.user = validate.email;
          return request;
        }
      } else return false;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
