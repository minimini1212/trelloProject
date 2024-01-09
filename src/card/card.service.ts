import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
  ) { }

  async findAll(columnId: number) {
    if (await this.cardRepository.findOneBy({ column: { id: columnId } }) === null)
      throw new NotFoundException('해당 카드들이 존재하지 않습니다.')
    return await this.cardRepository.find({
      where: { column: { id: columnId} },
    })
  }

  async create(createCardDto: CreateCardDto) {

   return this.cardRepository.save({
      column: { id: createCardDto.column_id },
      title: createCardDto.title,
      description: createCardDto.description,
      backgroundColor: createCardDto.backgroundColor,
      position: createCardDto.position,
    })
  }

  async delete(cardId: number) {
    if (await this.cardRepository.findOneBy({ cardId }) === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.')
    return await this.cardRepository.delete(cardId)
  }

  async update(updateCardDto: UpdateCardDto, cardId: number, managerId: number) {
    if (await this.cardRepository.findOneBy({ cardId }) === null)
      throw new NotFoundException('해당 카드가 존재하지 않습니다.')
    const cards = await this.cardRepository.findOne({
      where: { cardId: cardId },
      relations: { manager: true }
    })

    if (cards.manager.find((user) => user.id === managerId)) {
      console.log('abort')
       return await this.cardRepository
        .createQueryBuilder()
        .relation(Card, "manager")
        .of(cardId)
        .remove(managerId)
    }
      
    await this.cardRepository
      .createQueryBuilder()
      .relation(Card, "manager")
      .of(cardId)
      .add(managerId)
    return await this.cardRepository.update(cardId, updateCardDto)
  }
}
