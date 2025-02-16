import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { Match } from '../decorator/match.decorator';

export class RegistrationDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Пароль слишком слабый' },
  )
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Validate(Match, ['password'], { message: 'Пароли не совпадают' })
  readonly confirmPassword: string;
}

export class LoginDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
