import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @Column({ unique: true })
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  @MinLength(6, { message: '비밀번호는 6자 이상이어야 합니다.' })
  @Column({ select: false })
  password: string;

  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @IsString()
  @Column()
  name: string;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Board, (board) => board.creator)
  createdBoards: Board[];

  @ManyToMany((type) => Board, (board) => board.members)
  @JoinTable({
    name: 'boardUsers',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'boardId', referencedColumnName: 'boardId' },
  })
  joinedBoards: Board[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  comments: Comment[];
}
