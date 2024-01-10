import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    cardId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentRepository.save({
      cardId: cardId,
      comment: createCommentDto.comment,
    });
  }

  async findAll(cardId: number) {
    if ((await this.commentRepository.findOneBy({ cardId })) === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    return await this.commentRepository.find({
      where: { cardId: cardId },
    });
  }

  async findOne(cardId: number, commentId: number) {
    if ((await this.commentRepository.findOneBy({ cardId })) === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    return await this.commentRepository.find({
      where: { cardId: cardId, commentId: commentId },
    });
  }

  async update(commentId: number, updateCommentDto: UpdateCommentDto) {
    if ((await this.commentRepository.findOneBy({ commentId })) === null)
      throw new NotFoundException('해당 댓글이 존재하지 않습니다.');
    return await this.commentRepository.update(commentId, updateCommentDto);
  }

  async delete(commentId: number) {
    if ((await this.commentRepository.findOneBy({ commentId })) === null)
      throw new NotFoundException('해당 댓글이 존재하지 않습니다.');
    return await this.commentRepository.delete(commentId);
  }
}
