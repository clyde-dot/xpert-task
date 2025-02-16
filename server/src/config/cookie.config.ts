import { ConfigService } from '@nestjs/config';
import { addMilliseconds } from 'date-fns';
import { CookieOptions } from 'express';
import { parseTime } from 'src/libs/parse-time.lib';

export const cookieConfig = (configService: ConfigService): CookieOptions => {
  const expireStr =
    configService.getOrThrow<string>('JWT_REFRESH_EXPIRE') ?? '7d'; // Явная проверка
  const expiresInMs = parseTime(expireStr);
  const expiresAt = addMilliseconds(new Date(), expiresInMs);

  return {
    httpOnly: true,
    secure: configService.getOrThrow<string>('NODE_ENV') === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    maxAge: expiresInMs,
  };
};
