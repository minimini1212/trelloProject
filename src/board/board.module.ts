import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardUser } from 'src/boardUser/entities/board-user.entity';
import { Board } from './entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardUser])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
