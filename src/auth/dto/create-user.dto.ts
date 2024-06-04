import {
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

enum ValidRoles {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_USER = 'super_user',
}

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  @MinLength(4)
  lastName: string;

  @IsNumber()
  age: number;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsIn(['user', 'admin', 'super_user'])
  @IsOptional()
  roles?: string[];
}
