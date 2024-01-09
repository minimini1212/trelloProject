import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
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
}
