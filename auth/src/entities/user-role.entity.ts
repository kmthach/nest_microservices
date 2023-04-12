import { Role } from 'src/enums/role.enum';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    role: Role

}