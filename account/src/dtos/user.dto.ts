import { IsEmpty, IsNotEmpty } from "class-validator"

export class GetUserDto{
    id: number
    username: string
    password: string
}

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