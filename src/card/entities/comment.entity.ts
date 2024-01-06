import { IsNumber, IsString } from 'class-validator';
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
  @Column('varchar', { length: 1000, nullable: false })
  comment: string;

  @IsNumber()
  @Column('int', { select: true, nullable: false })
  cardId: number;

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
