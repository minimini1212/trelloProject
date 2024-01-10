import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @HttpCode(HttpStatus.OK)
  @Post('card/:cardId')
  async create(
    @Param('CardId') cardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    await this.commentService.create(+cardId, createCommentDto);
    return {
      status: HttpStatus.OK,
      message: '댓글 생성에 성공하였습니다.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('card/:cardId')
  async findAll(@Param('cardId') cardId: number) {
    const comments = await this.commentService.findAll(+cardId);
    return {
      status: HttpStatus.OK,
      comments,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('card/:cardId/:commentId')
  async findOne(@Param('cardId, commentId') cardId: number, commentId: number) {
    const comment = await this.commentService.findOne(+cardId, +commentId);
    return {
      status: HttpStatus.OK,
      comment,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Put('card/:cardId/:commentId')
  async update(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    await this.commentService.update(+commentId, updateCommentDto);
    return {
      status: HttpStatus.OK,
      message: '댓글 수정에 성공하였습니다.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('card/:cardId/:commentId')
  async remove(@Param('commentId') commentId: number) {
    await this.commentService.delete(+commentId);
    return {
      status: HttpStatus.OK,
      message: '댓글 삭제에 성공하였습니다.',
    };
  }
}
