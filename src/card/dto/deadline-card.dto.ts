import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsDate } from 'class-validator';

export class DeadlineCardDto extends PartialType(CreateCardDto) {
  @IsDate()
  deadline: Date;
}
