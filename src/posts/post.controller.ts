import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() postDto: CreatePostDto,
  ) {
    return this.postService.create(req.user.id, postDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findAllOwned(@Req() req: AuthenticatedRequest) {
    return this.postService.findAllOwned(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/:id')
  async findOneOwned(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.postService.findOneOwnedOrFail({ id }, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:id')
  async updatePost(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedPost: UpdatePostDto,
  ) {
    return this.postService.updatePost({ id }, updatedPost, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:id')
  async delete(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.postService.remove({ id }, req.user);
  }

  @Get(':slug')
  async findOnePublished(@Param('slug') slug: string) {
    return this.postService.findOnePublished({
      slug,
      published: true,
    });
  }

  @Get()
  async findAllPublished(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.postService.findAllPaginated(Number(page), Number(limit));
  }
}
