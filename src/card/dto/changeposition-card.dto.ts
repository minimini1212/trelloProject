import { IsNumber, IsOptional } from 'class-validator';

export class ChangePositionCardDto {
  @IsOptional()
  @IsNumber()
  prevCardId?: number;

  @IsOptional()
  @IsNumber()
  nextCardId?: number;
}
