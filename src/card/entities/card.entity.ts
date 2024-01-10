import { User } from 'src/user/entities/user.entity';
import { Columns } from 'src/column/entities/column.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity('Cards')
export class Card {
  @PrimaryGeneratedColumn()
  cardId: number;

  @Column()
  columnId: number;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @Column()
  title: string;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @Column('text')
  description: string;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @Column('')
  backgroundColor: string;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  @Column()
  position: string;

  @Column({ type: 'timestamptz' })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Columns, (column) => column.cards)
  column: Columns;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  manager: User[];

  @OneToMany((type) => Comment, (comment) => comment.card)
  comments: Comment[];
}
