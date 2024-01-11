import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @ManyToOne((type) => User, (user)=> user.boardUsers, { cascade: true })
  @JoinColumn({ name: 'user_id' , referencedColumnName: 'id'})
  user: User;

  @ManyToOne((type) => Board, (board)=> board.boardUsers)
  @JoinColumn({ name: 'board_id' , referencedColumnName: 'boardId'})
  board: Board;
}
