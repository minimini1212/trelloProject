import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { Repository } from 'typeorm';
import { ChangePositionColumnDto } from './dto/changeposition-column.dto';
import { LexoRank } from 'lexorank';
import { BoardService } from 'src/board/board.service';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
    private readonly boardService: BoardService,
  ) {}

  // 컬럼 생성
  async create(boardId, createColumnDto: CreateColumnDto, userId) {
    const { title } = createColumnDto;

    const board = await this.boardService.verifyBoardById(boardId);

    if (!board) {
      throw new NotFoundException('해당 보드가 존재하지 않습니다.');
    }

    // 컬럼에 접근 권한이 있는지 없는지 확인
    await this.boardService.checkMember(boardId, userId);

    // 밑에 있는 함수 findAll 실행 값을 할당
    const foundColumns = await this.findAll(boardId);

    if (foundColumns.length < 1) {
      const position = LexoRank.middle().toString();

      return await this.columnRepository.save({
        title,
        position,
        boardId,
      });
    }
    const position = LexoRank.parse(
      foundColumns[foundColumns.length - 1].position,
    );
    const NewPosition = position.genNext().toString();

    return await this.columnRepository.save({
      title,
      position: NewPosition,
      boardId,
    });
  }

  // 컬럼 순서 이동
  async changePosition(
    boardId: number,
    id: number,
    changePositionColumnDto: ChangePositionColumnDto,
    userId,
  ) {
    const { preColumnId, nextColumnId } = changePositionColumnDto;

    const board = await this.boardService.verifyBoardById(boardId);

    if (!board) {
      throw new NotFoundException('해당 보드가 존재하지 않습니다.');
    }

    // id로 컬럼 조회하는 함수 실행값 할당
    const selectedColumn = await this.findOne(id);

    if (!selectedColumn) {
      throw new NotFoundException('해당 컬럼이 존재하지 않습니다.');
    }

    // 컬럼에 접근 권한이 있는지 없는지 확인
    await this.boardService.checkMember(boardId, userId);

    // id로 컬럼 조회하는 함수 실행값 할당
    // 지정된 컬럼을 옮기고 난 후 왼쪽에 존재하는 컬럼
    const preColumn = await this.findOne(preColumnId);

    // id로 컬럼 조회하는 함수 실행값 할당
    // 지정된 컬럼을 옮기고 난 후 오론쪽에 존재하는 컬럼
    const nextColumn = await this.findOne(nextColumnId);

    // 지정된 컬럼을 맨 왼쪽자리로 옮겼을 때
    if (!preColumnId && nextColumnId) {
      const nextColumnPosition = LexoRank.parse(nextColumn.position);

      await this.columnRepository.update(
        { id },
        { position: nextColumnPosition.genPrev().toString() },
      );
    }
    // 지정된 컬럼을 맨 오른쪽자리로 옮겼을 때
    else if (preColumnId && !nextColumnId) {
      const preColumnPosition = LexoRank.parse(preColumn.position);

      await this.columnRepository.update(
        { id },
        { position: preColumnPosition.genNext().toString() },
      );
    }
    // 지정된 컬럼을 중간자리로 옮겼을 때
    else if (preColumnId && nextColumnId) {
      const nextColumnPosition = LexoRank.parse(nextColumn.position);
      const preColumnPosition = LexoRank.parse(preColumn.position);

      await this.columnRepository.update(
        { id },
        { position: preColumnPosition.between(nextColumnPosition).toString() },
      );
    }

    // 맨 밑에 있는 함수 findAll 실행 값 리턴
    return await this.findAll(boardId);
  }

  // 컬럼 이름 수정
  async updateTitle(
    boardId: number,
    columnId: number,
    updateColumnDto: UpdateColumnDto,
    userId,
  ) {
    const { title } = updateColumnDto;

    const board = await this.boardService.verifyBoardById(boardId);

    if (!board) {
      throw new NotFoundException('해당 보드가 존재하지 않습니다.');
    }

    // id로 컬럼 조회하는 함수 실행값 할당
    const foundColumn = await this.findOne(columnId);

    if (!foundColumn) {
      throw new NotFoundException('해당 컬럼이 존재하지 않습니다.');
    }

    // 컬럼에 접근 권한이 있는지 없는지 확인
    await this.boardService.checkMember(boardId, userId);

    return await this.columnRepository.save({
      id: columnId,
      title,
    });
  }

  // 컬럼 삭제
  async remove(columnId: number, boardId: number, userId) {
    const board = await this.boardService.verifyBoardById(boardId);

    if (!board) {
      throw new NotFoundException('해당 보드가 존재하지 않습니다.');
    }

    // id로 컬럼 조회하는 함수 실행값 할당
    const foundColumn = await this.findOne(columnId);

    if (!foundColumn) {
      throw new NotFoundException('해당 컬럼이 존재하지 않습니다.');
      4;
    }
    await this.columnRepository.softDelete({ id: columnId });

    // 컬럼에 접근 권한이 있는지 없는지 확인
    await this.boardService.checkMember(boardId, userId);

    return foundColumn;
  }

  // 전체 컬럼 조회(position 을 기준으로 'asc' 정렬이 되어있는 상태)
  async findAll(boardId: number) {
    const board = await this.boardService.verifyBoardById(boardId);

    if (!board) {
      throw new NotFoundException('해당 보드가 존재하지 않습니다.');
    }

    return await this.columnRepository.find({
      where: { boardId, deletedAt: null },
      order: {
        position: 'ASC',
      },
    });
  }

  // id를 통한 특정 컬럼 조회하는 함수
  async findOne(columnId) {
    return await this.columnRepository.findOne({
      where: {
        id: columnId,
        deletedAt: null,
      },
    });
  }
}
