import { Role } from 'src/enums/role.enum';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column, Entity } from 'typeorm';
@Entity()
export class UserHashPassword{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

}