import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { UserService } from 'src/user/user.service';
import { AuthorResponseDto } from './dto/author-responde.dto';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private userService: UserService,
  ) {}

  async create(id: string, postDto: CreatePostDto) {
    const author = await this.userService.findOneByOrFail({ id });

    const post = this.postRepository.create({
      slug: 'asdflbcvcvcvc-' + Math.random().toString(36).substring(2, 8),
      title: postDto.title,
      excerpt: postDto.excerpt,
      content: postDto.content,
      author: author,
    });

    return plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }
}
