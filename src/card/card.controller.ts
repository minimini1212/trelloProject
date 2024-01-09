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
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  findAll(@Param('id') id: number) {
    return this.cardService.findAll(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.cardService.delete(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  update(@Body() { managerId, ...updateCardDto}: { managerId: number } & UpdateCardDto, @Param('id') id: string) {
    return this.cardService.update(updateCardDto, +id, managerId);
  }
}
