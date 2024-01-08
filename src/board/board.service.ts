import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { BoardUser } from 'src/boardUser/entities/boardUser.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private readonly boardUserRepository: Repository<BoardUser>,
  ) {}

  //보드 생성
  async create(createBoardDto: CreateBoardDto, creatorId: number) {
    const board = this.boardRepository.create({ ...createBoardDto, creatorId });
    const savedBoard = await this.boardRepository.save(board);
    return { message: '보드가 생성되었습니다', board: savedBoard };
  }

  //보드 수정
  async update(id: number, updateBoardDto: UpdateBoardDto) {
    await this.verifyBoardById(id);
    await this.boardRepository.update(id, updateBoardDto);
    const updatedBoard = this.boardRepository.findOne({
      where: { boardId: id },
    });
    return { message: '보드가 수정 되었습니다.', board: updatedBoard };
  }

  //보드 삭제
  async remove(id: number, userId: number) {
    const board = await this.verifyBoardById(id);
    this.checkPermission(board.creatorId, userId);
    const deleteResult = await this.boardRepository.delete(id);
    if (deleteResult.affected) {
      return { message: '삭제되었습니다.' };
    }
  }

  //보드 초대
  async inviteUsers(boardId: number, userIds: number[]) {
    await this.verifyBoardById(boardId);
    const addedUsers = [];

    for (const userId of userIds) {
      const existingUser = await this.boardUserRepository.findOne({
        where: { userId, boardId },
      });
      if (!existingUser) {
        const newUser = this.boardUserRepository.create({ userId, boardId });
        await this.boardUserRepository.save(newUser);
        addedUsers.push(userId);
      }
    }
    return { message: `초대된 사용자: ${addedUsers.join(', ')}` };
  }

  //보드 ID로 보드 찾기
  private async verifyBoardById(id: number) {
    const board = await this.boardRepository.findOne({
      where: { boardId: id },
    });
    if (!board) {
      throw new NotFoundException('보드를 찾을 수 없습니다.');
    }
    return board;
  }

  //권한 체크
  private checkPermission(creatorId: number, userId: number) {
    if (creatorId !== userId) {
      throw new ForbiddenException('생성한 사용자만 삭제할 수 있습니다.');
    }
  }
}
