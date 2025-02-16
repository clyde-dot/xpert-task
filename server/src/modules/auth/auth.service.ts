import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { LoginDto, RegistrationDto } from './dto/auth.dto'
import type { User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ITokens } from '../../interface/token.interface'
import { compareSync } from 'bcrypt'
import { IUserOmitOptions } from 'src/interface/user.interface'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registratin(dto: RegistrationDto) {
    const candidate = await this.userService.getUserByEmail(dto.email)
    if (candidate) {
      throw new ConflictException('Пользователь с таким email уже существует')
    }
    const user = await this.userService.createUser(dto)
    this.logger.log(`Зарегистрирован новый пользователь: ${user.email}`)
    return user
  }

  async login(dto: LoginDto): Promise<User> {
    const user = await this.validateUser(dto.email, dto.password)
    this.logger.log(`Авторизован пользователь: ${user.email}`)
    return user
  }

  async validateUser(email: string, password: string): Promise<User> {
    const candidate = await this.userService.getUserByEmail(email, {
      password: false,
    })
    if (!candidate) {
      throw new NotFoundException('Пользователь не зарегистрирован')
    }

    const isMatch = compareSync(password, candidate.password)
    if (!isMatch) {
      throw new BadRequestException('Неверный пароль')
    }

    return candidate
  }

  async getTokens(user: IUserOmitOptions): Promise<ITokens> {
    const payload = { id: user.id, email: user.email }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRE'),
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRE'),
    })

    await this.userService.updateUser(user.id, { hashedToken: refreshToken })
    return { accessToken, refreshToken }
  }

  async logout(id: string) {
    const alreadyLoggedOut = await this.userService.getUserById(id, { hashedToken: false })
    if (!alreadyLoggedOut?.hashedToken) {
      throw new BadRequestException('Выход уже выполнен')
    }
    await this.userService.updateUser(id, { hashedToken: null })
    return true
  }

  async refresh(userRequest: IUserOmitOptions, refreshToken: string): Promise<{ user: IUserOmitOptions; tokens: ITokens }> {
    const user = await this.userService.getUserById(userRequest.id, { hashedToken: false })
    if (!user || !user.hashedToken) {
      throw new UnauthorizedException()
    }

    const isMatch = compareSync(refreshToken, user.hashedToken)
    if (!isMatch) {
      throw new UnauthorizedException()
    }

    const tokens = await this.getTokens(user)
    return { user, tokens }
  }
}
