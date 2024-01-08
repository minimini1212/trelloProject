import { IsNotEmpty } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
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

  @Column({ unsigned: true })
  userId: number;

  @Column()
  boardId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToMany(() => Board, (board) => board.boardUsers)
  board: Board;
}
