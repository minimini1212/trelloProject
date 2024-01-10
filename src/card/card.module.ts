import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { BoardService } from 'src/board/board.service';
import { BoardModule } from 'src/board/board.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), BoardModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
