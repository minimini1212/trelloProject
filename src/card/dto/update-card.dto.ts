import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateCardDto extends PartialType(CreateCardDto) {
    @IsString()
    title: string

    @IsString()
    description: string

    @IsString()     
    backgroundColor: string

    @IsNumber()
    position: number
}
