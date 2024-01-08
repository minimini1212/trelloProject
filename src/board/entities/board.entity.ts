import { IsNotEmpty } from 'class-validator';
import { BoardUser } from 'src/boardUser/entities/board-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'boards',
})
export class Board {
  @PrimaryGeneratedColumn()
  boardId: number;

  @IsNotEmpty({ message: '입력란을 확인해 주세요.' })
  @Column()
  boardName: string;

  @IsNotEmpty({ message: '입력란을 확인해 주세요.' })
  @Column()
  backgroundColor: string;

  @IsNotEmpty({ message: '입력란을 확인해 주세요.' })
  @Column({ type: 'text' })
  description: string;

  @Column()
  creatorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //병합 시 수정
  // @ManyToOne(() => User, (user) => user.boards)
  // creator: User;

  @OneToMany(() => BoardUser, (boardUser) => boardUser.board)
  boardUsers: BoardUser[];
}
