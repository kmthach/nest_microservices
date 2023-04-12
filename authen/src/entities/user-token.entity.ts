import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';

@Entity()
export class UserToken {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    token: string

    @Column()
    expireDate: string

}