import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string; // Use definite assignment assertion

  @IsString()
  @MinLength(6)
  password!: string; // Use definite assignment assertion
}
