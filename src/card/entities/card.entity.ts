import { User } from 'src/user/entities/user.entity';
import { Column as ColumnEntitiy } from 'src/column/entities/column.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('Cards')
export class Card {
  @PrimaryGeneratedColumn()
  cardId: number;

  @IsNotEmpty({ message: '비어 있는 항목이 있습니다.' })
  // @ManyToOne(() => ColumnEntitiy, (column) => column.columnId)
  @Column()
  columnId: number;

  // @ManyToOne(() => User, (user) => user.id)
  @Column()
  authorId: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
