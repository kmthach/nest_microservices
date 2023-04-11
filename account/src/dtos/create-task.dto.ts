import { IsEmpty, IsNotEmpty } from "class-validator"

export class CreateTaskDto{
    @IsEmpty()
    id: number

    @IsNotEmpty()
    title: string
    
    @IsNotEmpty()
    detail: string

    @IsNotEmpty()
    user_id: number

}