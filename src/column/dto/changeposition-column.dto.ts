import { PickType } from "@nestjs/mapped-types";
import { Columns } from "../entities/column.entity";

export class ChangePositionColumnDto extends PickType(Columns, [
    'position',
]) {}