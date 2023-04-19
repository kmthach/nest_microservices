import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserTask {

    @PrimaryColumn()
    taskId: number
    
    @Column()
    userId: number



}