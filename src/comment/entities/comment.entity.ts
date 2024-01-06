import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'comments',
})
export class Comment {
  @PrimaryGeneratedColumn()
  commentid: number;

  @IsString()
  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @Column('varchar', { length: 1000, nullable: false })
  comment: string;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  // @ManyToOne(() => CardEntitiy, (card) => cadrd.cardId)
  @Column('int', { select: true, nullable: false })
  cardId: number;

  // @ManyToOne(() => User, (user) => user.id)
  @IsNumber()
  @Column('int', { select: true, nullable: false })
  authorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
