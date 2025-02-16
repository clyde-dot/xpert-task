import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserService } from 'src/modules/user/user.service'
import { Request } from 'express'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly userService: UserService) {
    const configService = new ConfigService()
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.cookies?.refreshToken]),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    })
  }

  async validate({ id }: { id: string }) {
    const user = await this.userService.getUserById(id)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
