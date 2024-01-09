import { PickType } from '@nestjs/mapped-types';
import { Cards } from '../entities/card.entity';
import { Allow, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ChangePositionCardDto {
  @IsOptional()
  @IsNumber()
  prevCardId?: number;

  @IsOptional()
  @IsNumber()
  nextCardId?: number;
}
