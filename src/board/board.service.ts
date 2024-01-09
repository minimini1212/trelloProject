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
import { BoardUser } from 'src/boardUser/entities/board-user.entity';
import _ from 'lodash';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardUser)
    private readonly boardUserRepository: Repository<BoardUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //보드 생성
  async create(createBoardDto: CreateBoardDto, creatorId: number) {
    const board = this.boardRepository.create({
      ...createBoardDto,
      creatorId,
    });

    const savedBoard = await this.boardRepository.save(board);

    return savedBoard;
  }

  //보드 수정
  async update(id: number, updateBoardDto: UpdateBoardDto) {
    let oldBoard = await this.verifyBoardById(id);
    oldBoard = { ...oldBoard, ...updateBoardDto };

    const updatedBoard = await this.boardRepository.save(oldBoard);

    return updatedBoard;
  }

  //보드 삭제
  async remove(boardId: number, userId: number) {
    const board = await this.verifyBoardById(boardId);
    this.checkPermission(board.creatorId, userId);

    const deleteResult = await this.boardRepository.delete(boardId);

    return deleteResult;
  }

  //보드 초대
  async inviteUser(boardId: number, email: string, userId: number) {
    const board = await this.verifyBoardById(boardId);
    this.checkPermission(board.creatorId, userId);

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return { message: '존재하지 않는 사용자입니다.' };
    }

    const checkBoardUser = await this.boardUserRepository.findOne({
      where: { userId: user.id, boardId },
    });

    if (checkBoardUser) {
      return { message: '이미 초대된 사용자입니다.' };
    }

    const newBoardUser = this.boardUserRepository.create({
      userId: user.id,
      boardId,
    });

    await this.boardUserRepository.save(newBoardUser);

    return newBoardUser;
  }

  //보드 ID로 보드 찾기
  async verifyBoardById(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: { boardId },
    });
    if (!board) {
      throw new NotFoundException('보드를 찾을 수 없습니다.');
    }
    return board;
  }

  //권한 체크
  private checkPermission(creatorId: number, userId: number) {
    console.log('아이디', creatorId, userId);
    if (creatorId !== userId) {
      throw new ForbiddenException('생성한 사용자만 삭제할 수 있습니다.');
    }
  }
}
