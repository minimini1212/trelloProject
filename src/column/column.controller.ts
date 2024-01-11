import {
  Controller,
  Get,
  Post,
  Body,
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

  @Post()
  async create(
    @Param('boardId') boardId: string,
    @Body() createColumnDto: CreateColumnDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    const newColumn = await this.columnService.create(
      +boardId,
      createColumnDto,
      +userId,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: '생성 성공',
      newColumn,
    };
  }

  @Put(':id/position')
  async changePosition(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
    @Body() changePositionColumnDto: ChangePositionColumnDto,
    @Req() req,
  ) {
    const userId = req.user.id;

    const updatedColumn = await this.columnService.changePosition(
      +boardId,
      +id,
      changePositionColumnDto,
      +userId,
    );

    return {
      statusCode: HttpStatus.OK,
      message: '위치 이동 성공',
      updatedColumn,
    };
  }

  @Put(':id')
  async updateTitle(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
    @Body() updateColumnDto: UpdateColumnDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    const updatedColumn = await this.columnService.updateTitle(
      +boardId,
      +id,
      updateColumnDto,
      +userId,
    );

    return {
      statusCode: HttpStatus.OK,
      message: '이름 수정 성공',
      updatedColumn,
    };
  }

  @Delete(':id')
  async remove(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
    @Req() req,
  ) {
    const userId = req.user.id;
    const deletedColumn = await this.columnService.remove(
      +id,
      +boardId,
      +userId,
    );

    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 삭제 성공',
      deletedColumn,
    };
  }

  @Get()
  async findAll(@Param('boardId') boardId: string, @Req() req) {
    const columns = await this.columnService.findAll(+boardId);

    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 조회 성공',
      columns,
    };
  }
}
