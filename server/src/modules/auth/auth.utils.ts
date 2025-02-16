import type { User } from '@prisma/client'
import { ITokens } from '../../interface/token.interface'
import { IUserOmitOptions } from 'src/interface/user.interface'

export const formatAuthResponse = (tokens: ITokens, user: IUserOmitOptions) => ({
  user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  },
  accessToken: tokens.accessToken,
})
