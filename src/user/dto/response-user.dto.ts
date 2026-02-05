import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  updatedAt: Date;
}
