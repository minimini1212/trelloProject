import { PickType } from "@nestjs/mapped-types";
import { Columns } from "../entities/column.entity";
import { Allow, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ChangePositionColumnDto {

    @IsOptional()
    @IsNumber()
    preColumnId: number;

    @IsOptional()
    @IsNumber()
    nextColumnId: number;
  }