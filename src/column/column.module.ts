import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { BoardModule } from 'src/board/board.module';

@Module({
  imports: [
    AuthModule,
    BoardModule,
    TypeOrmModule.forFeature([Columns])
  ],
  controllers: [ColumnController],
  providers: [ColumnService],
})
export class ColumnModule {}
