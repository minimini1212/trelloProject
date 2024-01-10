import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  //보드 수정
  @Put(':boardId')
  async update(
    @Param('boardId') boardId: number,
    @Req() req,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const { id: userId } = req.user;
    const updatedBoard = await this.boardService.update(
      boardId,
      userId,
      updateBoardDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: '보드가 수정 되었습니다.',
      updatedBoard,
    };
  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
