import { IsNotEmpty } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'boardUsers',
})
export class BoardUser {
  @PrimaryGeneratedColumn()
  boardUserId: number;

  @Column({ default: false })
  isAdmin: boolean;

  // 병합 시 id지우고 수정
  // @Column()
  // userEmail: string;

  @Column()
  userId: number;

  @Column()
  boardId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 병합 시 수정
  // @ManyToOne(()=> User)
  // user:User;

  @ManyToMany(() => Board, (board) => board.boardUsers)
  board: Board;
}
