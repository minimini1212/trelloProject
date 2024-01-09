import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Get,
  UseGuards,
  Put,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  //보드 생성
  @Post()
  async create(@Body() createBoardDto: CreateBoardDto, @Req() req) {
    const { id: creatorId } = req.user;

    const createdBoard = await this.boardService.create(
      createBoardDto,
      creatorId,
    );

    return {
      message: '보드가 생성 되었습니다.',
      createdBoard,
    };
  }

  //보드 수정
  @Put(':boardId')
  async update(
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const updatedBoard = await this.boardService.update(
      boardId,
      updateBoardDto,
    );
    return {
      message: '보드가 수정 되었습니다.',
      updatedBoard,
    };
  }

  //보드 삭제
  @Delete(':boardId')
  async remove(@Param('boardId') boardId: number, @Req() req) {
    const { id: userId } = req.user;
    const deletedBoard = await this.boardService.remove(boardId, userId);
    return {
      message: '보드가 삭제 되었습니다.',
      deletedBoard,
    };
  }

  //보드 초대
  @Post(':boardId/invite')
  async inviteUser(
    @Param('boardId') boardId: number,
    @Body('email') email: string,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const invitedBoard = await this.boardService.inviteUser(
      boardId,
      email,
      userId,
    );
    return {
      message: '초대에 성공 하였습니다.',
      invitedBoard,
    };
  }

  //보드 조회
  @Get(':boardId')
  async getBoard(@Param('boardId') boardId: number) {
    const board = await this.boardService.verifyBoardById(boardId);
    return { board };
  }
}
