import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string = ''; // Default initial value

  @IsString()
  @MinLength(6)
  password: string = ''; // Default initial value
}
