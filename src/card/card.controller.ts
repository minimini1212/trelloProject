import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { update } from 'lodash';
import { UpdateCardDto } from './dto/update-card.dto';


@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    await this.cardService.create(createCardDto);
    return {
      status: HttpStatus.OK,
      message: "카드 생성에 성공하였습니다."
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
 async findAll(@Param('id') id: number) {
    const cards = await this.cardService.findAll(+id);
    return {
      status: HttpStatus.OK,
      cards
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    await this.cardService.delete(+id);
    return {
      status: HttpStatus.OK,
      message: "카드 삭제에 성공하였습니다."
    }
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  async update(@Body() { managerId, ...updateCardDto}: { managerId: number } & UpdateCardDto, @Param('id') id: string) {
    await this.cardService.update(updateCardDto, +id, managerId);
    return {
      status: HttpStatus.OK,
      message: "카드 수정에 성공하였습니다."
    }
  }
}
