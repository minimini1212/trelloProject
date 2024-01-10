import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { DeadlineCardDto } from './dto/deadline-card.dto';
import { ChangePositionCardDto } from './dto/changeposition-card.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    await this.cardService.create(createCardDto);
    return {
      status: HttpStatus.OK,
      message: '카드 생성에 성공하였습니다.',
    };
  }

  @Get('/:id')
  async findAll(@Param('id') id: number) {
    const cards = await this.cardService.findAll(+id);
    return {
      status: HttpStatus.OK,
      cards,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    await this.cardService.delete(+id);
    return {
      status: HttpStatus.OK,
      message: '카드 삭제에 성공하였습니다.',
    };
  }

  @Put('/:id')
  async update(
    @Body()
    { managerId, ...updateCardDto }: { managerId: number } & UpdateCardDto,
    @Param('id') id: string,
  ) {
    await this.cardService.update(updateCardDto, +id, managerId);
    return {
      status: HttpStatus.OK,
      message: '카드 수정에 성공하였습니다.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:id/deadline')
  async updateDeadline(
    @Body()
    deadlineCardDto: DeadlineCardDto,
    @Param('id') id: string,
  ) {
    await this.cardService.updateDeadline(deadlineCardDto, +id);
    return {
      status: HttpStatus.OK,
      message: '카드 데드라인 수정에 성공하였습니다.',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id/position')
  async changePosition(
    @Param('id') id: string,
    @Body() changePositionCardDto: ChangePositionCardDto,
  ) {
    await this.cardService.changePosition(+id, changePositionCardDto);
    return {
      status: HttpStatus.OK,
      message: '카드 위치가 변경되었습니다.',
    };
  }
}
