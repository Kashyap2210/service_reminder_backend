import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserEntity } from 'service_reminder_common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
