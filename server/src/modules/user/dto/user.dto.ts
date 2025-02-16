export class CreateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}

export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  hashedToken?: string | null;
}
