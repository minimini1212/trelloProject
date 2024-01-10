import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsDate, IsNotEmpty } from 'class-validator';

export class DeadlineCardDto extends PartialType(CreateCardDto) {
  @IsNotEmpty()
  @IsDate()
  deadline: Date;
}
