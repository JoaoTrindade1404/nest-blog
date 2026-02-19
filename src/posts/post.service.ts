import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { UserService } from 'src/user/user.service';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/post-response.dto';
import { createSlugFromText } from 'src/common/utils/create-slug-from-text';
import { User } from 'src/user/entities/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private userService: UserService,
  ) {}

  async create(id: string, postDto: CreatePostDto) {
    const author = await this.userService.findOneByOrFail({ id });

    const post = this.postRepository.create({
      slug: createSlugFromText(postDto.title),
      title: postDto.title,
      excerpt: postDto.excerpt,
      content: postDto.content,
      author: author,
    });

    const created = await this.postRepository.save(post).catch((e: unknown) => {
      if (e instanceof Error) {
        this.logger.error('Erro ao criar post', e.stack);
      }

      throw new BadRequestException('Erro ao criar o post');
    });

    return plainToInstance(PostResponseDto, created, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: ['author'],
    });

    return post;
  }

  async findOneOrFail(postData: Partial<Post>) {
    const post = await this.findOne(postData);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findOneOwned(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: { ...postData, author: { id: author.id } },
      relations: ['author'],
    });

    return post;
  }

  async findOneOwnedOrFail(postData: Partial<Post>, author: User) {
    const post = await this.getOwnedEntity(postData, author);

    return plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }

  async getOwnedEntity(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwned(postData, author);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findAllOwned(author: User) {
    const posts = await this.postRepository.find({
      where: {
        author: { id: author.id },
      },
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });

    return plainToInstance(PostResponseDto, posts, {
      excludeExtraneousValues: true,
    });
  }

  async updatePost(
    postData: Partial<Post>,
    updatedPost: UpdatePostDto,
    author: User,
  ) {
    const post = await this.getOwnedEntity(postData, author);

    post.title = updatedPost.title ?? post.title;
    post.content = updatedPost.content ?? post.content;
    post.excerpt = updatedPost.excerpt ?? post.excerpt;
    post.coverImageUrl = updatedPost.coverImageUrl ?? post.coverImageUrl;
    post.published = updatedPost.published ?? post.published;

    const savedPost = await this.postRepository.save(post);

    return plainToInstance(PostResponseDto, savedPost, {
      excludeExtraneousValues: true,
    });
  }

  async remove(postData: Partial<Post>, author: User) {
    const post = await this.findOneOrFail(postData);

    const deletedPost = await this.postRepository.delete({
      ...postData,
      author: { id: author.id },
    });

    return plainToInstance(PostResponseDto, deletedPost, {
      excludeExtraneousValues: true,
    });
  }

  async findOnePublished(postData: Partial<Post>) {
    const post = await this.findOneOrFail(postData);

    return plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(postData: Partial<Post>) {
    const posts = await this.postRepository.find({
      where: postData,
      order: {
        createdAt: 'DESC',
      },
      relations: ['author'],
    });

    return plainToInstance(PostResponseDto, posts, {
      excludeExtraneousValues: true,
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const [posts, total] = await this.postRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });

    return {
      data: posts,
      meta: {
        totalItems: total,
        itemCount: posts.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }
}
