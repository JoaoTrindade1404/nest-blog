import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email precisa ser preenchido' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha não pode esta vazia' })
  @IsString({ message: 'Senha precisa ser string' })
  password: string;
}
