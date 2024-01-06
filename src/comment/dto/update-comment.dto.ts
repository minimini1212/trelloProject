import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsString } from 'class-validator';
// import { ManyToOne } from 'typeorm';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsString()
  comment: string;

  @IsString()
  authorId: number;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}
