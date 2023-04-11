import { IsEmpty, IsNotEmpty } from "class-validator"


export class CreateUserDto{
    @IsEmpty()
    id: number

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    num_tasks: number
}