import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { ColumnModule } from './column/column.module';
import { CardModule } from './card/card.module';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
=======
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommentModule } from './comment/comment.module';
>>>>>>> d530e28ca2c19c25cb522a09e372a65d1d848c05
import { configModuleValidationSchema } from './configs/env-validate.config';
import { typeOrmModuleOptions } from './configs/database.config';

@Module({
  imports: [
    UserModule,
    AuthModule,
    BoardModule,
    ColumnModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    CardModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
