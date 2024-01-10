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
    return this.columnService.create(createColumnDto);
  }

  // 컬럼순서이동
  @Put(':id/position')
  changePosition(
    @Param('id') id: string,
    @Body() changePositionColumnDto: ChangePositionColumnDto,
  ) {
    return this.columnService.changePosition(+id, changePositionColumnDto);
  }

  // 컬럼수정
  @Put(':id')
  updateTitle(
    @Param('id') id: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.columnService.updateTitle(+id, updateColumnDto);
  }

  // 컬럼삭제
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnService.remove(+id);
  }

  // 컬럼조회(position 기준으로 'asc' 정렬)
  @Get()
  findAll() {
    return this.columnService.findAll();
  }
}
