import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity({
  name: 'boardUsers',
})
export class BoardUser {
  @PrimaryGeneratedColumn()
  boardUserId: number;

  @Column()
  userId: number;

  @Column()
  boardId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user)=> user.boardUsers)
  user: User;

  @ManyToOne((type) => Board, (board)=> board.boardUsers)
  board: Board;
}
