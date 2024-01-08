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

//@UseGuards(AuthGuard())
@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnService.create(createColumnDto);
  }

  @Put(':id/position')
  changePosition(
    @Param('id') id: string,
    @Body() changePositionColumnDto: ChangePositionColumnDto,
  ) {
    return this.columnService.changePosition(+id, changePositionColumnDto);
  }

  @Put(':id')
  updateTitle(
    @Param('id') id: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.columnService.updateTitle(+id, updateColumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnService.remove(+id);
  }
}
