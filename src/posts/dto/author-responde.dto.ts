import { Expose } from 'class-transformer';

export class AuthorResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
