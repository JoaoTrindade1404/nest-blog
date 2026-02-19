import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';

@Exclude()
export class ResponseCommentDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => ResponseUserDto)
  author: ResponseUserDto;

  @Expose()
  createdAt: Date;
}
