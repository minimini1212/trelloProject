import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  //보드 생성
  @Post()
  async create(@Body() createBoardDto: CreateBoardDto, @Req() req) {
    const { userId } = req.user;
    const createdBoard = await this.boardService.create(createBoardDto, userId);
    return { message: createdBoard.message, board: createdBoard.board };
  }

  //보드 수정
  @Patch(':boardId')
  async update(
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const updatedBoard = await this.boardService.update(
      boardId,
      updateBoardDto,
    );
    return { message: updatedBoard.message, board: updatedBoard.board };
  }

  //보드 삭제
  @Delete(':boardId')
  async remove(@Param('boardId') id: number, @Req() req) {
    const { userId } = req.user;
    const result = await this.boardService.remove(id, userId);
    return { message: result.message };
  }

  //보드 초대
  @Post(':boardId/invite')
  async invite(
    @Param('boardId') boardId: number,
    @Body() inviteData: { userIds: number[] },
  ) {
    const inviteResult = await this.boardService.inviteUsers(
      boardId,
      inviteData.userIds,
    );
    return { message: inviteResult.message };
  }
}
