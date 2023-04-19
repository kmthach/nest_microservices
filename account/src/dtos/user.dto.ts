import { IsEmpty, IsNotEmpty } from "class-validator"

export class GetUserDto{
    id: number
    username: string
    email: string
}

export class CreateUserDto{
    @IsEmpty()
    id: number

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    email: string
}

export class UserById {
    @IsNotEmpty()
    id: number
}