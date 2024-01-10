import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { UpdateCardDto } from './dto/update-card.dto';
import { LexoRank } from 'lexorank';
import { DeadlineCardDto } from './dto/deadline-card.dto';
import { ChangePositionCardDto } from './dto/changeposition-card.dto';
import { BoardService } from 'src/board/board.service';


@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    private boardService: BoardService

  ) {}
  async findAll(columnId: number) {
    const cards = await this.cardRepository.find({
      where: { column: { id: columnId } },
    });
    if (cards === null) 
      throw new NotFoundException('해당 컬룸이 존재하지 않습니다.');
    return cards
  }

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const { columnId, title, description, backgroundColor } = createCardDto;

    const foundCards = await this.cardRepository.find({
      order: {
        position: 'ASC',
      },
    });
    let newPosition = '';
    if (foundCards.length < 1) {
      newPosition = LexoRank.middle().toString();
    } else {
      const position = LexoRank.parse(
        foundCards[foundCards.length - 1].position,
      );
      newPosition = position.genNext().toString();
    }

    return this.cardRepository.save({
      column: { id: columnId },
      title,
      description,
      backgroundColor,
      position: newPosition,
    });
  }

  async delete(cardId: number) {
    if ((await this.cardRepository.findOneBy({ cardId })) === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    return await this.cardRepository.delete(cardId);
  }

  async update(
    updateCardDto: UpdateCardDto,
    cardId: number,
    managerId: number,
  ) {
    const card = (await this.cardRepository.findOne({ 
      where: { cardId },
      select: { column: {
        boardId: true
      }}
    }))

    await this.boardService.checkMember(
      card.column.boardId, 
      managerId,
    )
    
    if ( card === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    const cards = await this.cardRepository.findOne({
      where: { cardId: cardId },
      relations: { manager: true },
    });

    if (cards.manager.find((user) => user.id === managerId)) {
      await this.cardRepository
        .createQueryBuilder()
        .relation(Card, 'manager')
        .of(cardId)
        .remove(managerId);
    } else {
      await this.cardRepository
        .createQueryBuilder()
        .relation(Card, 'manager')
        .of(cardId)
        .add(managerId);
    }

    return await this.cardRepository.update(cardId, updateCardDto);
  }

  async updateDeadline(
    deadlineCardDto: DeadlineCardDto,
    cardId: number,
    managerId: number,
  ) {
    if ((await this.cardRepository.findOneBy({ cardId })) === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    const cards = await this.cardRepository.findOne({
      where: { cardId: cardId },
    });

    if (cards.manager.find((user) => user.id === managerId)) {
      return await this.cardRepository.update(cardId, deadlineCardDto);
    } else {
      throw new UnauthorizedException('데드라인을 수정할 권한이 없습니다.');
    }
  }

  async changePosition(
    cardId: number,
    changePositionCardDto: ChangePositionCardDto,
  ) {
    const { prevCardId, nextCardId } = changePositionCardDto;
    const selectedCard = await this.cardRepository.findOneBy({ cardId });
    if (selectedCard === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');

    const prevCard = await this.cardRepository.findOne({
      where: { cardId: prevCardId },
    });
    const nextCard = await this.cardRepository.findOne({
      where: { cardId: nextCardId },
    });

    if (!prevCard) {
      // 카드를 제일 위로 올릴 때
      const nextCardPosition = LexoRank.parse(nextCard.position);
      await this.cardRepository.update(
        { cardId },
        { position: nextCardPosition.genPrev().toString() },
      );
    } else if (!nextCard) {
      // 카드를 제일 아래로 내릴 때
      const prevCardPosition = LexoRank.parse(prevCard.position);
      await this.cardRepository.update(
        { cardId },
        { position: prevCardPosition.genPrev().toString() },
      );
    } else {
      const nextCardPosition = LexoRank.parse(nextCard.position);
      const prevCardPosition = LexoRank.parse(prevCard.position);

      await this.cardRepository.update(
        { cardId },
        { position: prevCardPosition.between(nextCardPosition).toString() },
      );
    }

    const currentCard = await this.cardRepository.findOne({
      where: { cardId: cardId },
    });
    return await this.cardRepository.find({
      where: { column: currentCard.column },
    });
  }
}
