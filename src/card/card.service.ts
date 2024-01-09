import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { UpdateCardDto } from './dto/update-card.dto';
import { ChangePositionCardDto } from './dto/changeposition-card.dto';
import { LexoRank } from 'lexorank';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
  ) {}

  async findAll(columnId: number) {
    if ((await this.cardRepository.findOneBy({ columnId })) === null)
      throw new NotFoundException('해당 카드들이 존재하지 않습니다.');
    return await this.cardRepository.find({
      where: { columnId: columnId },
    });
  }

  async create(createCardDto: CreateCardDto): Promise<Card> {
    // if (await columnRepository.findOneBy({ columnId: createCardDto.columnId }))
    // throw new NotFoundException('해당 컬룸이 존재하지 않습니다.')
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
      columnId,
      title,
      description,
      backgroundColor,
      position: newPosition,
    });
  }

  async delete(cardId: number) {
    if ((await this.cardRepository.findOneBy({ cardId })) === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    await this.cardRepository.delete(cardId);
    return 'Card deleted';
  }

  async update(updateCardDto: UpdateCardDto, cardId: number) {
    if ((await this.cardRepository.findOneBy({ cardId })) === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    await this.cardRepository.update(updateCardDto, cardId);
    return 'Card updated';
  }

  async updateDeadline(deadlineCardDto: DeadlineCardDto, cardId: number) {
    if ((await this.cardRepository.findOneBy({ cardId })) === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.');
    await this.cardRepository.update(DeadlineCardDto, cardId);
    return 'Card updated';
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
      // 카드를 중간으로 옮길 때
      const nextCardPosition = LexoRank.parse(nextCard.position);
      const prevCardPosition = LexoRank.parse(prevCard.position);

      await this.cardRepository.update(
        { cardId },
        { position: prevCardPosition.between(nextCardPosition).toString() },
      );
    }

    return await this.cardRepository.find({
      order: {
        position: 'ASC',
      },
    });
  }
}
