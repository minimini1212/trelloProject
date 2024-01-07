import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @IsNumber()
  cardId: number;

  @IsNotEmpty({ message: '내용이 없습니다.' })
  @IsString()
  comment: string;
}
