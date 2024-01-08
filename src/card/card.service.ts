import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
  ) {}

  async findAll(columnId: number) {
    if (await this.cardRepository.findOneBy({ columnId }) === null)
      throw new NotFoundException('해당 카드들이 존재하지 않습니다.')
    return await this.cardRepository.find({
      where: { columnId: columnId },
    })
  }

  async create(createCardDto: CreateCardDto): Promise<Card> {
    // if (await columnRepository.findOneBy({ columnId: createCardDto.columnId }))
    // throw new NotFoundException('해당 컬룸이 존재하지 않습니다.')
   return this.cardRepository.save({
    columnId: createCardDto.columnId,
    title: createCardDto.title,
    description: createCardDto.description,
    backgroundColor: createCardDto.backgroundColor,
    position: createCardDto.position,
   })
  }

  async delete(cardId: number) {
    if(await this.cardRepository.findOneBy({cardId}) === null) 
      throw new NotFoundException('해당 카드가 존재하지 않습니다.')
    await this.cardRepository.delete(cardId)
    return 'Card deleted'
  }

  async update(updateCardDto: UpdateCardDto, cardId: number) {
    if(await this.cardRepository.findOneBy({cardId}) === null) 
      throw new NotFoundException('해당 카드가 존재하지 않습니다.')
    await this.cardRepository.update(cardId, updateCardDto)
    return 'Card updated'
  }
}
