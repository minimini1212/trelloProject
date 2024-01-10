import { IsNotEmpty } from 'class-validator';
import { Columns } from 'src/column/entities/column.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
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

  @OneToMany((type) => Columns, (column) => column.board)
  columns: Columns[];

  @ManyToOne((type) => User, (user) => user.createdBoards)
  creator: User;
 
  // @ManyToMany((type) => User, (user) => user.joinedBoards)
  // members: User[];
}
