import { IsNotEmpty } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Columns {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: '입력란을 확인해주세요' })
  @Column()
  title: string;

  @Column()
  position: string;

  @Column()
  boardId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((Type) => Board, (board) => board.columns)
  @JoinColumn({ name: 'board_id', referencedColumnName: 'boardId' })
  board: Board;

  @OneToMany((type) => Card, (card) => card.column)
  cards: Card[];
}
