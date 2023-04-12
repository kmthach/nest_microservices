import { PrimaryGeneratedColumn } from 'typeorm';
import { Column, Entity } from 'typeorm';
@Entity()
export class UserHashPassword{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    hashpassword: string

}