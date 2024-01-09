import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Columns])
  ],
  controllers: [ColumnController],
  providers: [ColumnService],
})
export class ColumnModule {}
