import { IsNumber, IsOptional } from "class-validator";

export class ChangePositionColumnDto {

    @IsOptional()
    @IsNumber()
    preColumnId: number;

    @IsOptional()
    @IsNumber()
    nextColumnId: number;
  }