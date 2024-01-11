import { IsString, IsNotEmpty } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @IsNotEmpty({ message: '내용이 없습니다.' })
  @IsString()
  @Column('text')
  comment: string;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @Column('int', { select: true, nullable: false })
  cardId: number;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @Column('int', { select: true, nullable: false })
  authorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => Card, (card) => card.comments)
  card: Card;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;
}
