import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
