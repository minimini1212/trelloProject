import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { update } from 'lodash';
import { UpdateCardDto } from './dto/update-card.dto';
import { ChangePositionCardDto } from './dto/changeposition-card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Get('/:id')
  findAll(@Param('id') id: number) {
    return this.cardService.findAll(+id);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.cardService.delete(+id);
  }

  @Put('/:id')
  update(@Body() updateCardDto: UpdateCardDto, @Param('id') id: string) {
    return this.cardService.update(updateCardDto, +id);
  }

  @Put(':id/position')
  changePosition(
    @Param('id') id: string,
    @Body() changePositionCardDto: ChangePositionCardDto,
  ) {
    return this.cardService.changePosition(+id, changePositionCardDto);
  }
}
