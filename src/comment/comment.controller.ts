import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Post('card/:cardId')
  async create(
    @Param('cardId') cardId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    await this.commentService.create(+cardId, createCommentDto, +userId);
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
  async findOne(
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
  ) {
    const comment = await this.commentService.findOne(cardId, commentId);
    return {
      status: HttpStatus.OK,
      comment,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Put('card/:cardId/:commentId')
  async update(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    await this.commentService.update(+commentId, updateCommentDto, +userId);
    return {
      status: HttpStatus.OK,
      message: '댓글 수정에 성공하였습니다.',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Delete('card/:cardId/:commentId')
  async remove(@Param('commentId') commentId: number, @Request() req: any) {
    const userId = req.user.id;
    await this.commentService.delete(+commentId, +userId);
    return {
      status: HttpStatus.OK,
      message: '댓글 삭제에 성공하였습니다.',
    };
  }
}
