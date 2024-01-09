import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChangePositionColumnDto } from './dto/changeposition-column.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  // 컬럼생성
  @Post()
  create(@Body() createColumnDto: CreateColumnDto) {
    const newColumn =  this.columnService.create(createColumnDto);

    return {
      statusCode: HttpStatus.OK,
      message: '생성 성공',
      newColumn,
    };
  }

  // 컬럼순서이동
  @Put(':id/position')
  changePosition(
    @Param('id') id: string,
    @Body() changePositionColumnDto: ChangePositionColumnDto,
  ) {
    const updatedColumn =  this.columnService.changePosition(+id, changePositionColumnDto);

    return {
      statusCode: HttpStatus.OK,
      message: '위치 이동 성공',
      updatedColumn,
    };
  }

  // 컬럼수정
  @Put(':id')
  updateTitle(
    @Param('id') id: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    const updatedColumn =  this.columnService.updateTitle(+id, updateColumnDto);

    return {
      statusCode: HttpStatus.OK,
      message: '이름 수정 성공',
      updatedColumn,
    };
  }

  // 컬럼삭제
  @Delete(':id')
  remove(@Param('id') id: string) {
    const deletedColumn =  this.columnService.remove(+id);

    return {
      statusCode: HttpStatus.OK,
      message: '위치 이동 성공',
      deletedColumn,
    };
  }

  // 컬럼조회(position 기준으로 'asc' 정렬)
  @Get()
  findAll() {
    return this.columnService.findAll();
  }
}
