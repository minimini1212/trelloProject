import { User } from "src/user/entities/user.entity"
import { Columns }from "src/column/entities/column.entity"
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { IsNotEmpty } from "class-validator"

@Entity('Cards')
export class Card {
    @PrimaryGeneratedColumn()
    cardId: number

    @ManyToOne(() => Columns, (column) => column.id)
    column: Columns

    @ManyToMany(() => User, { cascade: true })
    @JoinTable()
    manager: User[]

    @IsNotEmpty({ message: "비어 있는 항목이 있습니다." })
    @Column()
    title: string

    @IsNotEmpty({ message: "비어 있는 항목이 있습니다." })
    @Column('text')
    description: string

    @IsNotEmpty({ message: "비어 있는 항목이 있습니다." })
    @Column('')
    backgroundColor: string

    @IsNotEmpty({ message: "비어 있는 항목이 있습니다." })
    @Column()
    position: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
