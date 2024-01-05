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
  @Column({ type: 'varchar', nullable: false })
  boardName: string;

  @IsNotEmpty({ message: '입력란을 확인해 주세요.' })
  @Column({ type: 'varchar', nullable: false })
  backgroundColor: string;

  @IsNotEmpty({ message: '입력란을 확인해 주세요.' })
  @Column({ type: 'text', nullable: false })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
