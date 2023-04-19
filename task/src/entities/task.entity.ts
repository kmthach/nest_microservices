import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryColumn()
    taskId: number

    @Column()
    title: string

    @Column()
    detail: string

}