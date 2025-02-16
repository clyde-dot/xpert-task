import { BadRequestException, Body, Controller, Get, HttpCode, Param, Put, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/guards/auth.guard'
import { UserFromRequest } from '../auth/decorator/user.decorator'
import { UpdateUserDto } from './dto/user.dto'

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(204)
  @Put(':id')
  updateUserById(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto)
  }

  @HttpCode(204)
  @Put()
  updateUser(@UserFromRequest('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto)
  }

  @Get('profile')
  getProfile(@UserFromRequest('id') id: string) {
    return this.userService.getUserById(id)
  }

  @Get(':id')
  getUserById(@Param('id') id: string | undefined) {
    if (!id) {
      throw new BadRequestException('id is required')
    }
    return this.userService.getUserById(id)
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers()
  }
}
