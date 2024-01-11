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

  async create(boardId, createColumnDto: CreateColumnDto, userId) {
    const { title } = createColumnDto;

    const board = await this.boardService.verifyBoardById(boardId);

    if (!board) {
      throw new NotFoundException('해당 보드가 존재하지 않습니다.');
    }

    await this.boardService.checkMember(boardId, userId);

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

    const selectedColumn = await this.findOne(id);

    if (!selectedColumn) {
      throw new NotFoundException('해당 컬럼이 존재하지 않습니다.');
    }

    await this.boardService.checkMember(boardId, userId);

    const preColumn = await this.findOne(preColumnId);

    const nextColumn = await this.findOne(nextColumnId);

    if (!preColumnId && nextColumnId) {
      const nextColumnPosition = LexoRank.parse(nextColumn.position);

      await this.columnRepository.update(
        { id },
        { position: nextColumnPosition.genPrev().toString() },
      );
    } else if (preColumnId && !nextColumnId) {
      const preColumnPosition = LexoRank.parse(preColumn.position);

      await this.columnRepository.update(
        { id },
        { position: preColumnPosition.genNext().toString() },
      );
    } else if (preColumnId && nextColumnId) {
      const nextColumnPosition = LexoRank.parse(nextColumn.position);
      const preColumnPosition = LexoRank.parse(preColumn.position);

      await this.columnRepository.update(
        { id },
        { position: preColumnPosition.between(nextColumnPosition).toString() },
      );
    }

    return await this.findAll(boardId);
  }

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

    const foundColumn = await this.findOne(columnId);

    if (!foundColumn) {
      throw new NotFoundException('해당 컬럼이 존재하지 않습니다.');
    }

    await this.boardService.checkMember(boardId, userId);

    return await this.columnRepository.save({
      id: columnId,
      title,
    });
  }

  async remove(columnId: number, boardId: number, userId) {
    const board = await this.boardService.verifyBoardById(boardId);

    if (!board) {
      throw new NotFoundException('해당 보드가 존재하지 않습니다.');
    }

    const foundColumn = await this.findOne(columnId);

    if (!foundColumn) {
      throw new NotFoundException('해당 컬럼이 존재하지 않습니다.');
      4;
    }
    await this.columnRepository.softDelete({ id: columnId });

    await this.boardService.checkMember(boardId, userId);

    return foundColumn;
  }

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

  async findOne(columnId) {
    return await this.columnRepository.findOne({
      where: {
        id: columnId,
        deletedAt: null,
      },
    });
  }
}
