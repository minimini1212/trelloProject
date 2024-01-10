import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class DeadlineCardDto extends PartialType(CreateCardDto) {
  @IsNotEmpty()
  @IsDateString()
  deadline: Date;
}
