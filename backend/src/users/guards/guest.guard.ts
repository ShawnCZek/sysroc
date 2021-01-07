import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class GuestGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let user: UserDto = request && request.hasOwnProperty('user') ? request.user : null;
    if (!user) {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();
      user = req.user;
    }

    if (user) {
      throw new AuthenticationError('Missing permissions.');
    }

    return true;
  }
}
