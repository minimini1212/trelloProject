import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCardDto {

    @IsNotEmpty({ message: "작성하지 않는 항목이 있습니다." })
    @IsNumber()
    column_id: number

    @IsNotEmpty({ message: "비어 있는 항목이 있습니다." })
    @IsString()
    title: string

    @IsNotEmpty({ message: "비어 있는 항목이 있습니다." })
    @IsString()
    description: string

    @IsNotEmpty({ message: "비어 있는 항목이 있습니다." })
    @IsString()     
    backgroundColor: string

    @IsNotEmpty({ message: "비어 있는 항목이 있습니다." })
    @IsNumber()
    position: number
}
