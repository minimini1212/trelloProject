import { IsNotEmpty } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import * as TypeOrm from 'typeorm'
// @TypeOrm.Column() -> 이런식으로 컬럼..
// 하나의 엔티티에서는 @PrimaryGeneratedColumn() 이것을 하나만 사용해야 한다는 규칙이 있다.
// 여러 개를 시도했다가 알게 된 사실 : 그냥 하나의 엔티티에서는 자동 증가는 하나의 컬럼만 사용가능..

@Entity()
// export class Column 으로 설정하면 @Column과 충돌..
export class Columns {
  @PrimaryGeneratedColumn({ unsigned: true })
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
  @JoinColumn()
  board: Board;

  @OneToMany((type) => Card, (card) => card.column)
  cards: Card[];

}
