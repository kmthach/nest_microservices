import { IsEmpty, IsNotEmpty } from "class-validator"

export class GetTaskDto{
    id: number
    title: string
    detail: string
    user_id: number
}

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