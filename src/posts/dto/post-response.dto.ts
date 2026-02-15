import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseUserDto } from '../../user/dto/response-user.dto';

@Exclude()
export class PostResponseDto {
  @Expose()
  id: string | number;

  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  excerpt?: string;

  @Expose()
  content?: string;

  @Expose()
  @Type(() => ResponseUserDto)
  author: ResponseUserDto;

  @Expose()
  coverImageUrl: string;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;
}
