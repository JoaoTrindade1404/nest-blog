import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { PostService } from 'src/posts/post.service';
import { plainToInstance } from 'class-transformer';
import { ResponseCommentDto } from './dto/response-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly postService: PostService,
  ) {}

  // ── Auxiliar interno ──────────────────────────────────────────────────────

  private async getOwnedComment(id: string, author: User): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado');
    }

    if (comment.author.id !== author.id) {
      throw new ForbiddenException(
        'Você não tem permissão para modificar este comentário',
      );
    }

    return comment;
  }

  // ── Criar ─────────────────────────────────────────────────────────────────

  async create(user: User, postId: string, dto: CreateCommentDto) {
    const post = await this.postService.findOneOrFail({ id: postId });

    const comment = this.commentRepository.create({
      author: user,
      content: dto.content,
      post: post,
    });

    const savedComment = await this.commentRepository.save(comment);

    return plainToInstance(ResponseCommentDto, savedComment, {
      excludeExtraneousValues: true,
    });
  }

  // ── Listar todos de um post (público) ────────────────────────────────────

  async findAllByPost(postId: string, page: number, limit: number) {
    await this.postService.findOneOrFail({ id: postId });

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: plainToInstance(ResponseCommentDto, comments, {
        excludeExtraneousValues: true,
      }),
      meta: {
        totalItems: total,
        itemCount: comments.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  // ── Listar meus comentários ───────────────────────────────────────────────

  async findAllOwned(author: User, page: number, limit: number) {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { author: { id: author.id } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: plainToInstance(ResponseCommentDto, comments, {
        excludeExtraneousValues: true,
      }),
      meta: {
        totalItems: total,
        itemCount: comments.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  // ── Buscar um por ID ──────────────────────────────────────────────────────

  async findOne(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado');
    }

    return plainToInstance(ResponseCommentDto, comment, {
      excludeExtraneousValues: true,
    });
  }

  // ── Atualizar (apenas dono) ───────────────────────────────────────────────

  async update(id: string, dto: UpdateCommentDto, author: User) {
    const comment = await this.getOwnedComment(id, author);

    comment.content = dto.content ?? comment.content;

    const saved = await this.commentRepository.save(comment);

    return plainToInstance(ResponseCommentDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  // ── Deletar (apenas dono) ─────────────────────────────────────────────────

  async remove(id: string, author: User) {
    await this.getOwnedComment(id, author);

    await this.commentRepository.delete(id);

    return { message: 'Comentário removido com sucesso' };
  }
}
