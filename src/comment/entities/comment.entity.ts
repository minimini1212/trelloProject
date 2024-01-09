import { IsString, IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn({ unsigned: true })
  commentId: number;

  @IsNotEmpty({ message: '내용이 없습니다.' })
  @IsString()
  @Column('text')
  comment: string;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  // @ManyToOne(() => CardEntitiy, (card) => card.cardId)
  @Column('int', { select: true, nullable: false })
  cardId: number;

  // @ManyToOne(() => User, (user) => user.id)
  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @Column('int', { select: true, nullable: false })
  authorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
