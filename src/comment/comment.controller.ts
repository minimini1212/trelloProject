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
  create(
    @Param('CardId') cardId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(+cardId, createCommentDto);
  }

  @Get('card/:cardId')
  findAll(@Param('cardId') cardId: number) {
    return this.commentService.findAll(+cardId);
  }

  @Get('card/:cardId/comment/:commentId')
  findOne(@Param('cardId, commentId') cardId: number, commentId: number) {
    return this.commentService.findOne(+cardId, +commentId);
  }

  @Put('card/:cardId/comment/:commentId')
  update(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(+commentId, updateCommentDto);
  }

  @Delete('card/:cardId/comment/:commentId')
  remove(@Param('commentId') commentId: number) {
    return this.commentService.delete(+commentId);
  }
}
