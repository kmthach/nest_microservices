import { IsEmpty, IsNotEmpty } from "class-validator"


export class RegisterDto{
    @IsEmpty()
    id: number

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    email: string
}