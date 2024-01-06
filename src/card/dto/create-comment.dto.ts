import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: '작성하지 않은 항목이 있습니다.' })
  @IsNumber()
  cardId: number;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @IsString()
  comment: string;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @IsNumber()
  authorId: number;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}
