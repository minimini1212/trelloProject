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
@Controller('board/:boardId/column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  // 컬럼생성
  @Post()
  async create(
    @Param('boardId') boardId: string,
    @Body() createColumnDto: CreateColumnDto,
  ) {
    const newColumn = await this.columnService.create(+boardId, createColumnDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '생성 성공',
      newColumn,
    };
  }

  // 컬럼순서이동
  @Put(':id/position')
  async changePosition(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
    @Body() changePositionColumnDto: ChangePositionColumnDto,
  ) {
    const updatedColumn = await this.columnService.changePosition(
      +boardId,
      +id,
      changePositionColumnDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: '위치 이동 성공',
      updatedColumn,
    };
  }

  // 컬럼수정
  @Put(':id')
  async updateTitle(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    const updatedColumn = await this.columnService.updateTitle(
      +boardId,
      +id,
      updateColumnDto,
    );

    return {
      statusCode: HttpStatus.OK,
      message: '이름 수정 성공',
      updatedColumn,
    };
  }

  // 컬럼삭제
  @Delete(':id')
  async remove(@Param('boardId') boardId: string, @Param('id') id: string) {
    const deletedColumn = await this.columnService.remove(+id, +boardId);

    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 삭제 성공',
      deletedColumn,
    };
  }

  // 컬럼조회(position 기준으로 'asc' 정렬)
  @Get()
  async findAll(@Param('boardId') boardId: string) {
    const columns = await this.columnService.findAll(+boardId);

    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 조회 성공',
      columns,
    };
  }
}
