import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

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
  async update(
    boardId: number,
    userId: number,
    updateBoardDto: UpdateBoardDto,
  ) {
    const board = await this.verifyBoardById(boardId);

    await this.checkMember(boardId, userId);

    let oldBoard = { ...board, ...updateBoardDto };
    const updatedBoard = await this.boardRepository.save(oldBoard);
    return updatedBoard;
  create(createBoardDto: CreateBoardDto) {
    return 'This action adds a new board';
  }

  findAll() {
    return `This action returns all board`;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  //멤버 확인
  private async checkMember(boardId: number, userId: number) {
    const boardUser = await this.boardUserRepository.findOne({
      where: { boardId, userId },
    });
    if (!boardUser) {
      throw new ForbiddenException('보드 멤버만 수정할 수 있습니다.');
    }
  }

  //생성자 확인
  private checkPermission(creatorId: number, userId: number) {
    if (creatorId !== userId) {
      throw new ForbiddenException('생성한 사용자만 삭제할 수 있습니다.');
    }
  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
