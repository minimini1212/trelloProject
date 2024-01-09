import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'boardUsers',
})
export class BoardUser {
  @PrimaryGeneratedColumn()
  boardUserId: number;

  @Column({ default: false })
  isAdmin: boolean;

  @Column()
  userId: number;

  @Column()
  boardId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
