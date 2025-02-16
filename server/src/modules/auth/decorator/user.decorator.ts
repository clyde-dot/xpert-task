import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserFromRequest = createParamDecorator(
  (data: string | undefined, req: ExecutionContext) => {
    const request = req.switchToHttp().getRequest();
    return data ? request.user[data] : request.user;
  },
);
