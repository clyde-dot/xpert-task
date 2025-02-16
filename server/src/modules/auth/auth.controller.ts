import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegistrationDto } from './dto/auth.dto'
import { ITokens } from '../../interface/token.interface'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { cookieConfig } from 'src/config/cookie.config'
import { JwtAuthGuard } from './guards/auth.guard'
import { UserFromRequest } from './decorator/user.decorator'
import { formatAuthResponse } from './auth.utils'
import { JwtRefreshGuard } from './guards/auth-refresh.guard'
import { User } from '@prisma/client'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(201)
  @Post('registration')
  async registration(@Body() dto: RegistrationDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.registratin(dto)
    const tokens: ITokens = await this.authService.getTokens(user)
    const payload = formatAuthResponse(tokens, user)

    res.cookie('refreshToken', tokens.refreshToken, cookieConfig(this.configService))
    return payload
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const user = await this.authService.login(dto)
    const tokens: ITokens = await this.authService.getTokens(user)
    const payload = formatAuthResponse(tokens, user)

    res.cookie('refreshToken', tokens.refreshToken, cookieConfig(this.configService))
    return res.status(200).json(payload)
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@UserFromRequest() userRequest: User, @Res() res: Response) {
    const status = await this.authService.logout(userRequest.id)
    if (!status) {
      throw new BadRequestException('Выход не выполнен')
    }
    res.clearCookie('refreshToken')
    return res.status(200).json(true)
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@UserFromRequest() userRequest: User, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.authService.refresh(userRequest, req.cookies.refreshToken)
    const payload = formatAuthResponse(tokens, user)

    res.cookie('refreshToken', tokens.refreshToken, cookieConfig(this.configService))
    return payload
  }
}
