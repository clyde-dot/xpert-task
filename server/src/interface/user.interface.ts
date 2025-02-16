export interface IUserOmitOptions {
  id: string
  firstName: string
  lastName: string
  email: string
  password?: string
  hashedToken?: string | null
}
