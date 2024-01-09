import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { DataSource, Repository } from 'typeorm';
import { ChangePositionColumnDto } from './dto/changeposition-column.dto';
import { LexoRank } from 'lexorank';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
    private readonly dataSource: DataSource,
  ) {}

  // 컬럼 생성
  async create(createColumnDto: CreateColumnDto) {
    const { title } = createColumnDto;

    const foundColumns = await this.columnRepository.find({
      order: {
        position: 'ASC',
      },
    });

    if (foundColumns.length < 1) {
      const position = LexoRank.middle().toString();

      return await this.columnRepository.save({
        title,
        position,
      });
    } else {
      const position = LexoRank.parse(
        foundColumns[foundColumns.length - 1].position,
      );
      const NewPosition = position.genNext().toString();

      return await this.columnRepository.save({
        title,
        position: NewPosition,
      });
    }
  }

  // 컬럼 순서 이동
  async changePosition(
    id: number,
    changePositionColumnDto: ChangePositionColumnDto,
  ) {
    const { preColumnId, nextColumnId } = changePositionColumnDto;

    const selectedColumn = await this.columnRepository.findOne({
      where: {
        id,
      },
    });

    if (!selectedColumn) {
      throw new NotFoundException('해당 컬럼이 존재하지 않습니다.');
    }

    // 지정된 컬럼을 옮기고 난 후 왼쪽에 존재하는 컬럼
    const preColumn = await this.columnRepository.findOne({
      where: {
        id: preColumnId,
      },
    });

    // 지정된 컬럼을 옮기고 난 후 오론쪽에 존재하는 컬럼
    const nextColumn = await this.columnRepository.findOne({
      where: {
        id: nextColumnId,
      },
    });

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

    return await this.columnRepository.find({
      order: {
        position: 'ASC',
      },
    });
  }

  // 하나의 api 안에 세 번의 db와의 접촉이 맘에 들지 않는데 어떠한 방법이 있을지 고민해보자구..
  // 컬럼 이름 수정
  async updateTitle(columnId: number, updateColumnDto: UpdateColumnDto) {
    const { title } = updateColumnDto;

    const foundColumn = await this.columnRepository.findOne({
      where: {
        id: columnId,
      },
    });

    const updatedColumn = await this.dataSource.transaction(async (manager) => {
      if (!foundColumn) {
        throw new NotFoundException('해당 컬럼이 존재하지 않습니다.');
      }

      await manager.update(Columns, { id: columnId }, { title });

      return await manager.findOne(Columns, {
        where: {
          id: columnId,
        },
      });
    });
    return updatedColumn;
  }

  // 컬럼 삭제
  async remove(columnId: number) {
    const foundColumn = await this.columnRepository.findOne({
      where: {
        id: columnId,
      },
    });

    if (!foundColumn) {
      throw new NotFoundException('해당 컬럼이 존재하지 않습니다.');
    }
    return await this.columnRepository.delete({ id: columnId });
  }

  // 전체 컬럼 조회(position 을 기준으로 'asc' 정렬이 되어있는 상태)
  async findAll() {
    return await this.columnRepository.find({
      order: {
        position: 'ASC',
      },
    });
  }
}
