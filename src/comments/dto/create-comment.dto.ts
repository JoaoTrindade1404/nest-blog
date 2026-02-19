import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Comentario deve ser uma string' })
  @IsNotEmpty({ message: 'Comentário não pode estar vazio' })
  @MinLength(2, { message: 'Comentário deve ter no minimo 2 caracteres' })
  content: string;
}
