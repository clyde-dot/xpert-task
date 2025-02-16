import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { hashSync } from 'bcrypt'
import { IOmit } from '../../interface/global-omit.interface'
import { IUserOmitOptions } from 'src/interface/user.interface'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = hashSync(dto.password, 10)
    const newUser = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    })
    this.logger.log(`New user signed up: ${newUser.email}`)
    return newUser
  }

  async getUserByEmail(email: string, omit?: IOmit) {
    return await this.prismaService.user.findUnique({ where: { email }, omit })
  }

  async getUserById(id: string, omit?: IOmit): Promise<IUserOmitOptions | null> {
    return await this.prismaService.user.findUnique({ where: { id }, omit })
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    let data = dto

    //if updated password
    if (data.password) {
      console.log('data.password')
      data.password = hashSync(data.password, 10)
    }

    //if updated hashedToken
    if (data.hashedToken && data.hashedToken !== null) {
      console.log('data.hashedToken')
      data.hashedToken = hashSync(data.hashedToken, 10)
    }

    return await this.prismaService.user.update({ where: { id }, data })
  }

  async getAllUsers() {
    return await this.prismaService.user.findMany()
  }
}
