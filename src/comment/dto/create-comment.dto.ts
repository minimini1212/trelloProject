import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: '내용이 없습니다.' })
  @IsString()
  comment: string;
}
